import mysql from 'mysql2';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

(async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('Database connection successful!');
    connection.release(); // Vapauta yhteys pooliin
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
})();

export default promisePool;
