import promisePool from '../utils/database.js';

/**
 * Fetch all comments from the database
 * TODO: limit the number of comments returned based on query parameter?
 * @returns {Promise<Array>} array of comments
 */
const fetchComments = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM Comments');
    return rows;
  } catch (e) {
    console.error('fetchComments', e.message);
    throw new Error('Database error ' + e.message);
  }
};

/**
 * Fetch a comment from the database based on id
 * @param {number} id comment id
 * @returns {Promise<object>} comment details
 */
const fetchCommentById = async (id) => {
  try {
    const sql = 'SELECT * FROM Comments WHERE comment_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    console.log('fetchCommentById', rows);
    return rows[0];
  } catch (e) {
    console.error('fetchCommentById', e.message);
    throw new Error('Database error ' + e.message);
  }
};

/**
 * Add a new comment to the database
 * @param {object} newComment comment details
 * @returns {Promise<number>} id of the new comment
 */
const addComment = async (newComment) => {
  const sql = `INSERT INTO Comments
                (media_id, user_id, comment_text, created_at)
                VALUES (?, ?, ?, ?)`;
  const params = [
    newComment.media_id,
    newComment.user_id,
    newComment.comment_text,
    newComment.created_at,
  ];
  try {
    const result = await promisePool.query(sql, params);
    // console.log('addComment', result);
    return result[0].insertId;
  } catch (error) {
    console.error('addComment', error.message);
    throw new Error('Database error ' + error.message);
  }
};

/**
 * Update a comment in the database
 * @param {number} id comment id
 * @param {object} updatedComment updated comment details
 * @returns {Promise<number>} number of affected rows
 */
const updateComment = async (id, updatedComment) => {
  const sql = `UPDATE Comments SET comment_text = ? WHERE comment_id = ?`;
  const params = [updatedComment.comment_text, id];
  try {
    const result = await promisePool.query(sql, params);
    console.log('updateComment', result);
    return result[0].affectedRows;
  } catch (error) {
    console.error('updateComment', error.message);
    throw new Error('Database error ' + error.message);
  }
};

export {fetchComments, fetchCommentById, addComment, updateComment};
