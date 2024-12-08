import bcrypt from 'bcryptjs';
import promisePool from '../utils/database.js';

const fetchUsers = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM Users');
    return rows;
  } catch (e) {
    console.error('fetchUsers', e.message);
    throw new Error('Something went wrong with the database');
  }
};

const fetchUserById = async (id) => {
  try {
    const sql = 'SELECT * FROM Users WHERE user_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    console.log('fetchUserById', rows);
    return rows[0];
  } catch (e) {
    console.error('fetchUserById', e.message);
    throw new Error('Something went wrong with the database');
  }
};

const addUser = async (newUser) => {
  const hashedPassword = await bcrypt.hash(newUser.password, 10);

  // Tarkista, onko email tai username jo tietokannassa
  const checkSql = 'SELECT * FROM Users WHERE username = ? OR email = ?';
  const checkParams = [newUser.username, newUser.email];
  const [existingUsers] = await promisePool.query(checkSql, checkParams);

  if (existingUsers.length > 0) {
    throw new Error('Username or email already exists');
  }

  const sql = `INSERT INTO Users
                (username, email, password, created_at)
                VALUES (?, ?, ?, ?)`;
  const params = [newUser.username, newUser.email, hashedPassword, newUser.created_at];
  try {
    const result = await promisePool.query(sql, params);
    console.log('User added:', result);
    return result[0].insertId;
  } catch (error) {
    console.error('addUser error:', error.message);
    throw new Error('Something went wrong with the database');
  }
};


const updateUser = async (id, updatedUser) => {
  const sql = `UPDATE Users SET username = ?, email = ? WHERE user_id = ?`;
  const params = [updatedUser.username, updatedUser.email, id];
  try {
    const result = await promisePool.query(sql, params);
    console.log('updateUser', result);
    return result[0].affectedRows;
  } catch (error) {
    console.error('updateUser', error.message);
    throw new Error('Something went wrong with the database');
  }
};

const authenticateUser = async (email, password) => {
  const sql = `SELECT * FROM Users WHERE email = ?`;
  try {
    const [rows] = await promisePool.query(sql, [email]);
    console.log('Fetched User from Database:', rows); // Debugging logs
    const user = rows[0];

    if (!user) {
      console.error('No user found for email:', email);
      return null; // Email doesn't exist
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password Match:', isMatch); // Debugging logs

    if (!isMatch) {
      return null; // Password mismatch
    }

    return user;
  } catch (error) {
    console.error('authenticateUser error:', error.message);
    throw new Error('Database error');
  }
};



const deleteUser = async (id) => {
  const sql = `DELETE FROM Users WHERE user_id = ?`;
  try {
    const [result] = await promisePool.query(sql, [id]);
    console.log('deleteUser', result);
    return result.affectedRows;
  } catch (error) {
    console.error('deleteUser', error.message);
    throw new Error('Something went wrong with the database');
  }
};

/**
 * Fetch a user by email from the database
 * @param {string} email user's email
 * @returns {Promise<object|null>} user details if found, null otherwise
 */
const fetchUserByEmail = async (email) => {
  const sql = `SELECT * FROM Users WHERE email = ?`;
  try {
    const [rows] = await promisePool.query(sql, [email]);
    console.log('fetchUserByEmail', rows);
    return rows[0] || null;
  } catch (error) {
    console.error('fetchUserByEmail', error.message);
    throw new Error('Database error ' + error.message);
  }
};


export {
  fetchUsers,
  fetchUserById,
  addUser,
  updateUser,
  authenticateUser,
  deleteUser,
  fetchUserByEmail,
};
