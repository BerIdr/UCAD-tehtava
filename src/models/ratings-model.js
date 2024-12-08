import promisePool from '../utils/database.js';

/**
 * Fetch all ratings from the database
 * @returns {Promise<Array>} array of ratings
 */
const fetchRatings = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM Ratings');
    return rows;
  } catch (e) {
    console.error('fetchRatings', e.message);
    throw new Error('Database error ' + e.message);
  }
};

/**
 * Fetch a rating from the database based on id
 * @param {number} id rating id
 * @returns {Promise<object>} rating details
 */
const fetchRatingById = async (id) => {
  try {
    const sql = 'SELECT * FROM Ratings WHERE rating_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    console.log('fetchRatingById', rows);
    return rows[0];
  } catch (e) {
    console.error('fetchRatingById', e.message);
    throw new Error('Database error ' + e.message);
  }
};

/**
 * Add a new rating to the database
 * @param {object} newRating rating details
 * @returns {Promise<number>} id of the new rating
 */
const addRating = async (newRating) => {
  const sql = `INSERT INTO Ratings
                (media_id, user_id, rating_value, created_at)
                VALUES (?, ?, ?, ?)`;
  const params = [
    newRating.media_id,
    newRating.user_id,
    newRating.rating_value,
    newRating.created_at,
  ];
  try {
    const result = await promisePool.query(sql, params);
    // console.log('addRating', result);
    return result[0].insertId;
  } catch (error) {
    console.error('addRating', error.message);
    throw new Error('Database error ' + error.message);
  }
};

/**
 * Update a rating in the database
 * @param {number} id rating id
 * @param {object} updatedRating updated rating details
 * @returns {Promise<number>} number of affected rows
 */
const updateRating = async (id, updatedRating) => {
  const sql = `UPDATE Ratings SET rating_value = ? WHERE rating_id = ?`;
  const params = [updatedRating.rating_value, id];
  try {
    const result = await promisePool.query(sql, params);
    console.log('updateRating', result);
    return result[0].affectedRows;
  } catch (error) {
    console.error('updateRating', error.message);
    throw new Error('Database error ' + error.message);
  }
};

/**
 * Calculate the average rating for a media item
 * @param {number} mediaId media item id
 * @returns {Promise<number>} average rating value
 */
const calculateAverageRating = async (mediaId) => {
  const sql = `SELECT AVG(rating_value) AS averageRating FROM Ratings WHERE media_id = ?`;
  try {
    const [rows] = await promisePool.query(sql, [mediaId]);
    console.log('calculateAverageRating', rows);
    return rows[0].averageRating || 0;
  } catch (error) {
    console.error('calculateAverageRating', error.message);
    throw new Error('Database error ' + error.message);
  }
};

export {
  fetchRatings,
  fetchRatingById,
  addRating,
  updateRating,
  calculateAverageRating,
};
