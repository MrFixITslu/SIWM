
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

let pool;
let isMock = false;

// Mock database state
const mockDb = {
  users: [
    {
      id: 1,
      name: 'Vision79 SLU',
      email: 'vision79slu@gmail.com',
      password: bcrypt.hashSync('Password123!', 10),
      role: 'admin',
      status: 'active',
      contact_number: '1234567890',
      created_at: new Date(),
      updated_at: new Date(),
      permissions: ['dashboard', 'incoming-shipments', 'inventory', 'orders', 'dispatch', 'warehouse-management', 'vendors', 'assets', 'master-data', 'reports', 'notifications', 'compliance', 'user-management', 'help'],
      email_notifications_enabled: true
    }
  ],
  warehouses: [
    { id: 1, name: 'Seattle Main Hub', code: 'WH-SEA-01', location: 'Seattle, WA', capacity: 10000, status: 'active', email: 'seattle@company.com', smtp_host: 'smtp.seattle.com', smtp_port: 587, smtp_user: 'seattle@company.com', smtp_pass: 'password', smtp_secure: false, smtp_from_name: 'Seattle Main Hub' },
    { id: 2, name: 'New York Distribution', code: 'WH-NY-02', location: 'New York, NY', capacity: 5000, status: 'active', email: 'ny@company.com', smtp_host: 'smtp.ny.com', smtp_port: 465, smtp_user: 'ny@company.com', smtp_pass: 'password', smtp_secure: true, smtp_from_name: 'New York Distribution' }
  ],
  inventory_items: [
    { id: 1, name: 'SFP+ 10G Transceiver', sku: 'TRX-10G-SFP', category: 'Transceivers', quantity: 150, unit: 'pcs', reorder_point: 50, safety_stock: 20, status: 'active', warehouse_id: 1, primary_vendor_id: 1 },
    { id: 2, name: 'Cat6a Shielded Cable 1000ft', sku: 'CBL-C6A-SH-1K', category: 'Cables', quantity: 12, unit: 'reels', reorder_point: 15, safety_stock: 5, status: 'active', warehouse_id: 1, primary_vendor_id: 1 },
    { id: 3, name: '24-Port PoE+ Managed Switch', sku: 'SW-24-POE-MNG', category: 'Switches', quantity: 8, unit: 'pcs', reorder_point: 10, safety_stock: 3, status: 'active', warehouse_id: 1, primary_vendor_id: 2 }
  ],
  warehouse_orders: [],
  outbound_shipments: [],
  vendors: [
    { id: 1, name: 'FiberOptics Direct', contact_name: 'John Doe', email: 'john@fiberoptics.com', phone: '555-0192', lead_time_days: 10 },
    { id: 2, name: 'NetGear Wholesale', contact_name: 'Jane Smith', email: 'jane@netgear.com', phone: '555-0193', lead_time_days: 14 }
  ],
  support_tickets: [],
  inventory_movements: [],
  system_settings: [
    { id: 1, setting_key: 'run_rate', weekly_installs: 66, source: 'default' }
  ],
  audit_logs: []
};

class MockPool {
  async query(sql, params = []) {
    const queryLower = sql.toLowerCase().trim();
    console.log(`[MOCK DB QUERY] ${sql.substring(0, 100)}${sql.length > 100 ? '...' : ''} | Params: ${JSON.stringify(params)}`);

    if (queryLower.includes('select now()')) {
      return { rows: [{ now: new Date() }] };
    }

    if (queryLower.includes('select count(*)') || queryLower.includes('select count(1)')) {
      const match = queryLower.match(/from\s+([a-zA-Z0-9_]+)/);
      if (match && match[1]) {
        const table = match[1];
        const list = mockDb[table] || [];
        return { rows: [{ count: String(list.length) }] };
      }
      return { rows: [{ count: '0' }] };
    }

    if (queryLower.includes('from users')) {
      if (queryLower.includes('email = $1')) {
        const email = String(params[0]).toLowerCase().trim();
        const user = mockDb.users.find(u => u.email === email && u.status === 'active');
        return { rows: user ? [user] : [] };
      }
      if (queryLower.includes('id = $1')) {
        const id = parseInt(params[0], 10);
        const user = mockDb.users.find(u => u.id === id);
        return { rows: user ? [user] : [] };
      }
      return { rows: mockDb.users };
    }

    for (const table of Object.keys(mockDb)) {
      if (queryLower.includes(`from ${table}`)) {
        if (queryLower.includes('id = $1')) {
          const id = parseInt(params[0], 10);
          const item = mockDb[table].find(x => x.id === id);
          return { rows: item ? [item] : [] };
        }
        return { rows: mockDb[table] };
      }
    }

    if (queryLower.includes('insert into users')) {
      const newUser = {
        id: mockDb.users.length + 1,
        name: params[0],
        email: params[1],
        password: params[2].startsWith('$2') ? params[2] : bcrypt.hashSync(params[2], 10),
        role: params[3] || 'Requester',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
        permissions: params[4] || [],
        email_notifications_enabled: true
      };
      mockDb.users.push(newUser);
      return { rows: [newUser] };
    }

    for (const table of Object.keys(mockDb)) {
      if (queryLower.includes(`insert into ${table}`)) {
        const newItem = { id: mockDb[table].length + 1, created_at: new Date() };
        mockDb[table].push(newItem);
        return { rows: [newItem] };
      }
    }

    return { rows: [] };
  }

  async connect() {
    return {
      query: async (sql, params) => this.query(sql, params),
      release: () => {}
    };
  }

  async end() {
    console.log('[MOCK DB] Connection ended');
  }
}

const connectDB = async () => {
  // Check if credentials exist before attempting connection
  if (!process.env.DB_HOST || !process.env.DB_USER) {
    console.warn('---------------------------------------------------------------------------');
    console.warn('WARNING: Database connection credentials are missing.');
    console.warn('Using in-memory mock PostgreSQL fallback.');
    console.warn('---------------------------------------------------------------------------');
    pool = new MockPool();
    isMock = true;
    return;
  }

  try {
    pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    await pool.query('SELECT NOW()');
    console.log('PostgreSQL Connected successfully.');
  } catch (error) {
    console.warn('---------------------------------------------------------------------------');
    console.warn(`WARNING: Failed to connect to PostgreSQL: ${error.message}`);
    console.warn('Falling back to robust in-memory mock PostgreSQL.');
    console.warn('---------------------------------------------------------------------------');
    pool = new MockPool();
    isMock = true;
  }
};

const getPool = () => {
  if (!pool) {
    pool = new MockPool();
    isMock = true;
  }
  return pool;
};

module.exports = { connectDB, getPool };