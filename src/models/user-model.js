import promisePool from '../utils/database.js';

/**
 * Fetch all users from the database
 * @returns {Promise<Array>} array of users
 */
const fetchUsers = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM Users');
    return rows;
  } catch (e) {
    console.error('fetchUsers', e.message);
    throw new Error('Database error ' + e.message);
  }
};

/**
 * Fetch a user from the database based on id
 * @param {number} id user id
 * @returns {Promise<object>} user details
 */
const fetchUserById = async (id) => {
  try {
    const sql = 'SELECT * FROM Users WHERE user_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    console.log('fetchUserById', rows);
    return rows[0];
  } catch (e) {
    console.error('fetchUserById', e.message);
    throw new Error('Database error ' + e.message);
  }
};

/**
 * Add a new user to the database
 * @param {object} newUser user details
 * @returns {Promise<number>} id of the new user
 */
const addUser = async (newUser) => {
  const sql = `INSERT INTO Users
                (username, email, password, created_at)
                VALUES (?, ?, ?, ?)`;
  const params = [
    newUser.username,
    newUser.email,
    newUser.password,
    newUser.created_at,
  ];
  try {
    const result = await promisePool.query(sql, params);
    return result[0].insertId;
  } catch (error) {
    console.error('addUser', error.message);
    throw new Error('Database error ' + error.message);
  }
};

/**
 * Update a user's details in the database
 * @param {number} id user id
 * @param {object} updatedUser updated user details
 * @returns {Promise<number>} number of affected rows
 */
const updateUser = async (id, updatedUser) => {
  const sql = `UPDATE Users SET username = ?, email = ? WHERE user_id = ?`;
  const params = [updatedUser.username, updatedUser.email, id];
  try {
    const result = await promisePool.query(sql, params);
    console.log('updateUser', result);
    return result[0].affectedRows;
  } catch (error) {
    console.error('updateUser', error.message);
    throw new Error('Database error ' + error.message);
  }
};

/**
 * Authenticate a user by email and password
 * @param {string} email user's email
 * @param {string} password user's password
 * @returns {Promise<object|null>} user details if authenticated, null otherwise
 */
const authenticateUser = async (email, password) => {
  const sql = `SELECT * FROM Users WHERE email = ? AND password = ?`;
  try {
    const [rows] = await promisePool.query(sql, [email, password]);
    console.log('authenticateUser', rows);
    return rows[0] || null;
  } catch (error) {
    console.error('authenticateUser', error.message);
    throw new Error('Database error ' + error.message);
  }
};

/**
 * Delete a user from the database
 * @param {number} id user id
 * @returns {Promise<number>} number of affected rows
 */
const deleteUser = async (id) => {
  const sql = `DELETE FROM Users WHERE user_id = ?`;
  try {
    const [result] = await promisePool.query(sql, [id]);
    console.log('deleteUser', result);
    return result.affectedRows; // Palauttaa poistettujen rivien määrän
  } catch (error) {
    console.error('deleteUser', error.message);
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
};
