import promisePool from '../utils/database.js';

/**
 * Fetch all media items from the database
 * TODO: limit the number of items returned based on query parameter?
 * @returns {Promise<Array>} array of media items
 */
const fetchMediaItems = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM MediaItems');
    return rows;
  } catch (e) {
    console.error('fetchMediaItems', e.message);
    throw new Error('Database error ' + e.message);
  }
};

/**
 * Fetch a media item from the database based on id
 * @param {number} id media item id
 * @returns {Promise<object>} media item details
 */
const fetchMediaItemById = async (id) => {
  try {
    const sql = 'SELECT * FROM MediaItems WHERE media_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    console.log('fetchMediaItemById', rows);
    return rows[0];
  } catch (e) {
    console.error('fetchMediaItemById', e.message);
    throw new Error('Database error ' + e.message);
  }
};

/**
 * Add a new media item to the database
 * @param {object} newItem media file details
 * @returns {Promise<number>} id of the new item
 */
const addMediaItem = async (newItem) => {
  const sql = `INSERT INTO MediaItems
                (user_id, title, description, filename, filesize, media_type)
                VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    newItem.user_id,
    newItem.title,
    newItem.description,
    newItem.filename,
    newItem.filesize,
    newItem.media_type,
    newItem.created_at,
  ];
  try {
    const result = await promisePool.query(sql, params);
    // console.log('addMediaItem', result);
    return result[0].insertId;
  } catch (error) {
    console.error('addMediaItem', error.message);
    throw new Error('Database error ' + error.message);
  }
};

/**
 * Update a media item in the database
 * @param {number} id
 * @param {object} updatedItem
 * @returns {Promise<number>} number of affected rows
 */
const updateMediaItem = async (id, updatedItem) => {
  const sql = `UPDATE MediaItems SET title = ?, description = ? WHERE media_id = ?`;
  const params = [updatedItem.title, updatedItem.description, id];
  try {
    const result = await promisePool.query(sql, params);
    console.log('updateMediaItem', result);
    return result[0].affectedRows;
  } catch (error) {
    console.error('updateMediaItem', error.message);
    throw new Error('Database error ' + error.message);
  }
};

/**
 * Delete a media item from the database
 * @param {number} id media item id
 * @returns {Promise<number>} number of affected rows
 */

const deleteMediaItem = async (id) => {
  try {
    const sql = 'DELETE FROM MediaItems WHERE media_id = ?';
    const [result] = await promisePool.query(sql, [id]);
    console.log('deleteMediaItem', result);
    return result.affectedRows;
  } catch (error) {
    console.error('deleteMediaItem', error.message);
    throw new Error('Database error ' + error.message);
  }
};

export {
  fetchMediaItems,
  fetchMediaItemById,
  addMediaItem,
  updateMediaItem,
  deleteMediaItem,
};
