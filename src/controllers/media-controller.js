import {
  fetchMediaItems,
  addMediaItem,
  fetchMediaItemById,
  updateMediaItem,
  deleteMediaItem,
} from '../models/media-model.js';

const getItems = async (req, res) => {
  try {
    res.json(await fetchMediaItems());
  } catch (e) {
    console.error('getItems', e.message);
    res.status(503).json({error: 503, message: 'DB error'});
  }
};

const getItemById = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log('getItemById', id);
  try {
    const item = await fetchMediaItemById(id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({message: 'Item not found'});
    }
  } catch (error) {
    console.error('getItemById', error.message);
    res.status(503).json({error: 503, message: error.message});
  }
};

const postItem = async (req, res) => {
  const {title, description} = req.body;
  if (!title || !description || !req.file) {
    return res
      .status(400)
      .json({message: 'Title, description and file required'});
  }
  console.log('post req body', req.body);
  console.log('post req file', req.file);
  const newMediaItem = {
    user_id: 1, // Tämä voidaan myöhemmin korvata autentikoidulla käyttäjällä
    title,
    description,
    filename: req.file.filename,
    filesize: req.file.size,
    media_type: req.file.mimetype,
    created_at: new Date().toISOString(),
  };
  try {
    const id = await addMediaItem(newMediaItem);
    res.status(201).json({message: 'Item added', id});
  } catch (error) {
    return res
      .status(400)
      .json({message: 'Something went wrong: ' + error.message});
  }
};

const putItem = async (req, res) => {
  const {title, description} = req.body;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || !title || !description) {
    return res.status(400).json({message: 'Invalid data or ID'});
  }
  console.log('put req body', req.body);
  const newDetails = {title, description};
  try {
    const itemsEdited = await updateMediaItem(id, newDetails);
    if (itemsEdited === 0) {
      return res.status(404).json({message: 'Item not found'});
    } else {
      return res.status(200).json({message: 'Item updated', id});
    }
  } catch (error) {
    return res
      .status(500)
      .json({message: 'Something went wrong: ' + error.message});
  }
};

import promisePool from '../utils/database.js'; // Ensure the database connection is imported

const deleteItem = async (req, res) => {
  const id = parseInt(req.params.id, 10); // Parse the media_id from the request
  const userId = req.user?.id; // Assuming req.user is populated by the auth middleware

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  try {
    // Step 1: Verify media ownership
    const verifyOwnershipSql = 'SELECT user_id FROM MediaItems WHERE media_id = ?';
    const [mediaRows] = await promisePool.query(verifyOwnershipSql, [id]);

    if (mediaRows.length === 0) {
      return res.status(404).json({ message: 'Media item not found' });
    }

    if (mediaRows[0].user_id !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this item' });
    }

    // Step 2: Delete associated comments
    const deleteCommentsSql = 'DELETE FROM Comments WHERE media_id = ?';
    const [commentsResult] = await promisePool.query(deleteCommentsSql, [id]);
    console.log(`Deleted ${commentsResult.affectedRows} comments associated with MediaItem ID ${id}`);

    // Step 3: Delete the media item
    const deleteMediaSql = 'DELETE FROM MediaItems WHERE media_id = ?';
    const [mediaResult] = await promisePool.query(deleteMediaSql, [id]);

    if (mediaResult.affectedRows > 0) {
      res.json({ message: 'Item deleted successfully', id });
    } else {
      res.status(404).json({ message: 'Media item not found' });
    }
  } catch (error) {
    console.error('deleteItem', error.message);
    res.status(500).json({ message: 'Something went wrong: ' + error.message });
  }
};





export {getItems, getItemById, postItem, putItem, deleteItem};
