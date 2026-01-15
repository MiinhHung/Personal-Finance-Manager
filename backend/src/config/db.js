const sql = require('mssql');
const env = require('./env');

const sqlConfig = {
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  server: env.db.server,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

if (env.db.port) {
  sqlConfig.port = parseInt(env.db.port, 10);
}

const poolPromise = new sql.ConnectionPool(sqlConfig)
  .connect()
  .then((pool) => {
    console.log('✅ Connected to SQL Server');
    return pool;
  })
  .catch((err) => {
    console.error('❌ Database Connection Failed! Bad Config: ', err);
    throw err;
  });

module.exports = { sql, poolPromise };