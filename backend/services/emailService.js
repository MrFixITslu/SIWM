const nodemailer = require('nodemailer');

let defaultTransporter;
const dynamicTransporters = new Map();

// Check if all necessary environment variables are set for global fallback.
const isEmailConfigured = process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS;

if (isEmailConfigured) {
    defaultTransporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: parseInt(process.env.EMAIL_PORT || '587', 10) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 10000,
    });
    
    // Verify default connection configuration
    defaultTransporter.verify()
      .then(() => console.log('Global fallback email service is configured and ready.'))
      .catch(err => {
        console.error('--- GLOBAL EMAIL SERVICE VERIFICATION FAILED ---');
        console.error('Full error details:', err.message);
        console.error('------------------------------------------');
    });
}

/**
 * Gets a cached or new transporter for the given SMTP configuration.
 */
const getDynamicTransporter = (config) => {
    const cacheKey = `${config.host}:${config.port}:${config.auth.user}`;
    if (dynamicTransporters.has(cacheKey)) {
        return dynamicTransporters.get(cacheKey);
    }
    
    console.log(`[EmailService] Creating new dynamic transporter for ${config.host}:${config.port} (${config.auth.user})`);
    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
            user: config.auth.user,
            pass: config.auth.pass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
    });
    
    dynamicTransporters.set(cacheKey, transporter);
    return transporter;
};

/**
 * Sends an email using a dynamic or fallback SMTP transporter.
 * @param {object} mailData - The email data.
 * @param {string} mailData.to - The recipient's email address.
 * @param {string} mailData.subject - The subject of the email.
 * @param {string} mailData.html - The HTML body of the email.
 * @param {number|string} [mailData.warehouseId] - Optional warehouse ID to load specific SMTP settings.
 */
const sendEmail = async ({ to, subject, html, warehouseId }) => {
    let smtpConfig = null;
    let transporterToUse = defaultTransporter;
    let fromName = process.env.EMAIL_FROM_NAME || 'Vision79 Shipping, Inventory & Warehouse Management';
    let fromEmail = process.env.EMAIL_USER;

    // 1. Try to load dynamic database-driven SMTP config for the specified warehouse
    if (warehouseId) {
        try {
            const { getPool } = require('../config/db');
            const db = getPool();
            const result = await db.query(
                'SELECT smtp_host, smtp_port, smtp_user, smtp_pass, smtp_secure, smtp_from_name FROM warehouses WHERE id = $1',
                [warehouseId]
            );
            
            if (result && result.rows && result.rows.length > 0) {
                const wh = result.rows[0];
                if (wh.smtp_host && wh.smtp_user && wh.smtp_pass) {
                    smtpConfig = {
                        host: wh.smtp_host,
                        port: parseInt(wh.smtp_port || '587', 10),
                        secure: wh.smtp_secure || parseInt(wh.smtp_port || '587', 10) === 465,
                        auth: {
                            user: wh.smtp_user,
                            pass: wh.smtp_pass,
                        },
                        fromName: wh.smtp_from_name || wh.name
                    };
                    console.log(`[EmailService] Loaded database-driven SMTP config for Warehouse ID ${warehouseId}`);
                }
            }
        } catch (e) {
            console.error(`[EmailService] Error fetching SMTP config for warehouse ${warehouseId}:`, e.message);
        }
    }

    // 2. Decide which transporter and from details to use
    if (smtpConfig) {
        transporterToUse = getDynamicTransporter(smtpConfig);
        fromEmail = smtpConfig.auth.user;
        if (smtpConfig.fromName) {
            fromName = smtpConfig.fromName;
        }
    }

    if (!transporterToUse) {
        console.warn(`[EmailService] Email not sent to <${to}> with subject "${subject}" because no valid SMTP configuration was found (either per-warehouse or global fallback).`);
        return;
    }

    try {
        const mailOptions = {
            from: `"${fromName}" <${fromEmail}>`,
            to,
            subject,
            html,
        };
        
        let info = await transporterToUse.sendMail(mailOptions);
        console.log(`[EmailService] Email sent successfully using ${smtpConfig ? `warehouse ${warehouseId} dynamic SMTP` : 'global fallback SMTP'} to <${to}>. Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`[EmailService] Error sending email to <${to}>:`, error);
    }
};

module.exports = { sendEmail };
