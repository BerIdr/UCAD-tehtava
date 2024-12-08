import {
  fetchLikes,
  fetchLikeById,
  addLike,
  removeLike,
} from '../models/likes-model.js';

// Fetch all likes
const getLikes = async (req, res) => {
  try {
    const likes = await fetchLikes();
    res.json(likes);
  } catch (e) {
    console.error('getLikes', e.message);
    res.status(503).json({ error: 503, message: 'DB error' });
  }
};

// Fetch a like by its ID
const getLikeById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const like = await fetchLikeById(id);
    if (like) {
      res.json(like);
    } else {
      res.status(404).json({ message: 'Like not found' });
    }
  } catch (e) {
    console.error('getLikeById', e.message);
    res.status(503).json({ error: 503, message: e.message });
  }
};

const postLike = async (req, res) => {
  const { media_id, user_id } = req.body;

  if (!media_id || !user_id) {
    return res.status(400).json({ message: 'Media ID and user ID required' });
  }

  try {
    const id = await addLike({
      media_id,
      user_id,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '), // Convert to MariaDB DATETIME format
    });

    res.status(201).json({ message: 'Like added', id });
  } catch (e) {
    console.error('postLike', e.message);
    res.status(400).json({ message: 'Something went wrong: ' + e.message });
  }
};


// Delete a like by its ID
const deleteLike = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const rowsDeleted = await removeLike(id);
    if (rowsDeleted) {
      res.json({ message: 'Like deleted', id });
    } else {
      res.status(404).json({ message: 'Like not found' });
    }
  } catch (e) {
    console.error('deleteLike', e.message);
    res.status(503).json({ error: 503, message: e.message });
  }
};

export { getLikes, getLikeById, postLike, deleteLike };
