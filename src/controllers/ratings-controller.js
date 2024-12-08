import {
  fetchRatings,
  fetchRatingById,
  addRating,
  updateRating,
  calculateAverageRating,
} from '../models/ratings-model.js';

const getRatings = async (req, res) => {
  try {
    res.json(await fetchRatings());
  } catch (e) {
    console.error('getRatings', e.message);
    res.status(503).json({error: 503, message: 'DB error'});
  }
};

const getRatingById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const rating = await fetchRatingById(id);
    if (rating) {
      res.json(rating);
    } else {
      res.status(404).json({message: 'Rating not found'});
    }
  } catch (e) {
    console.error('getRatingById', e.message);
    res.status(503).json({error: 503, message: e.message});
  }
};

const postRating = async (req, res) => {
  const {media_id, user_id, rating_value} = req.body;
  if (!media_id || !user_id || !rating_value) {
    return res
      .status(400)
      .json({message: 'Media ID, user ID, and rating value required'});
  }
  try {
    const id = await addRating({
      media_id,
      user_id,
      rating_value,
      created_at: new Date().toISOString(),
    });
    res.status(201).json({message: 'Rating added', id});
  } catch (e) {
    console.error('postRating', e.message);
    res.status(400).json({message: 'Something went wrong: ' + e.message});
  }
};

const getAverageRating = async (req, res) => {
  const mediaId = parseInt(req.params.mediaId);
  try {
    const average = await calculateAverageRating(mediaId);
    res.json({mediaId, average});
  } catch (e) {
    console.error('getAverageRating', e.message);
    res.status(503).json({error: 503, message: e.message});
  }
};

export {getRatings, getRatingById, postRating, getAverageRating};
