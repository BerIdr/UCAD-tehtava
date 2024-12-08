import promisePool from '../utils/database.js';

/**
 * Fetch all likes from the database
 * TODO: limit the number of likes returned based on query parameter?
 * @returns {Promise<Array>} array of likes
 */
const fetchLikes = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM Likes');
    return rows;
  } catch (e) {
    console.error('fetchLikes', e.message);
    throw new Error('Database error ' + e.message);
  }
};

/**
 * Fetch a like from the database based on id
 * @param {number} id like id
 * @returns {Promise<object>} like details
 */
const fetchLikeById = async (id) => {
  try {
    const sql = 'SELECT * FROM Likes WHERE like_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    console.log('fetchLikeById', rows);
    return rows[0];
  } catch (e) {
    console.error('fetchLikeById', e.message);
    throw new Error('Database error ' + e.message);
  }
};

/**
 * Add a new like to the database
 * @param {object} newLike like details
 * @returns {Promise<number>} id of the new like
 */
const addLike = async (newLike) => {
  const sql = `INSERT INTO Likes
                (media_id, user_id, created_at)
                VALUES (?, ?, ?)`;
  const params = [newLike.media_id, newLike.user_id, newLike.created_at];
  try {
    const result = await promisePool.query(sql, params);
    // console.log('addLike', result);
    return result[0].insertId;
  } catch (error) {
    console.error('addLike', error.message);
    throw new Error('Database error ' + error.message);
  }
};

/**
 * Remove a like from the database
 * @param {number} id like id
 * @returns {Promise<number>} number of affected rows
 */
const removeLike = async (id) => {
  const sql = `DELETE FROM Likes WHERE like_id = ?`;
  try {
    const result = await promisePool.query(sql, [id]);
    console.log('removeLike', result);
    return result[0].affectedRows;
  } catch (error) {
    console.error('removeLike', error.message);
    throw new Error('Database error ' + error.message);
  }
};

/**
 * Count likes for a specific media item
 * @param {number} mediaId media item id
 * @returns {Promise<number>} total number of likes
 */
const countLikesByMediaId = async (mediaId) => {
  const sql = `SELECT COUNT(*) AS likeCount FROM Likes WHERE media_id = ?`;
  try {
    const [rows] = await promisePool.query(sql, [mediaId]);
    console.log('countLikesByMediaId', rows);
    return rows[0].likeCount;
  } catch (error) {
    console.error('countLikesByMediaId', error.message);
    throw new Error('Database error ' + error.message);
  }
};

export {fetchLikes, fetchLikeById, addLike, removeLike, countLikesByMediaId};
