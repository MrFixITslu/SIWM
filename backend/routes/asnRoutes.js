const express = require('express');
const router = express.Router();
const { getASNs, getASNById, createASN, updateASN, deleteASN, submitFees, approveFees, confirmPayment, receiveShipment, completeShipment } = require('../controllers/asnController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ALL_ROLES } = require('../config/roles');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for individual files
    fieldSize: 50 * 1024 * 1024, // 50MB limit for fields
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types including Excel files
    cb(null, true);
  }
});

router.route('/')
    .get(protect, authorize(...ALL_ROLES), getASNs)
    .post(protect, authorize('admin', 'manager', 'Warehouse'), upload.fields([
        { name: 'quoteFile', maxCount: 1 },
        { name: 'poFile', maxCount: 1 },
        { name: 'invoiceFile', maxCount: 1 },
        { name: 'bolFile', maxCount: 1 }
    ]), (err, req, res, next) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
        }
        return res.status(400).json({ error: 'File upload error: ' + err.message });
      }
      next(err);
    }, createASN);

router.route('/:id')
    .get(protect, authorize(...ALL_ROLES), getASNById)
    .put(protect, authorize('admin', 'manager', 'Warehouse'), upload.fields([
        { name: 'quoteFile', maxCount: 1 },
        { name: 'poFile', maxCount: 1 },
        { name: 'invoiceFile', maxCount: 1 },
        { name: 'bolFile', maxCount: 1 }
    ]), (err, req, res, next) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
        }
        return res.status(400).json({ error: 'File upload error: ' + err.message });
      }
      next(err);
    }, updateASN)
    .delete(protect, authorize('admin', 'manager'), deleteASN);

router.post('/:id/submit-fees', protect, authorize('Broker'), submitFees);
router.post('/:id/approve-fees', protect, authorize('Finance'), approveFees);
router.post('/:id/confirm-payment', protect, authorize('Broker'), confirmPayment);
router.post('/:id/receive', protect, authorize('admin', 'manager', 'Warehouse'), receiveShipment);
router.post('/:id/complete', protect, authorize('Warehouse', 'manager', 'admin'), completeShipment);

module.exports = router;