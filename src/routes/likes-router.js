import express from 'express';
import {
  getLikes,
  getLikeById,
  postLike,
  deleteLike,
} from '../controllers/likes-controller.js';

const likesRouter = express.Router();

// Define routes for likes
likesRouter.get('/', getLikes); // Fetch all likes
likesRouter.get('/:id', getLikeById); // Fetch a like by its ID
likesRouter.post('/', postLike); // Add a new like
likesRouter.delete('/:id', deleteLike); // Delete a like by its ID

export default likesRouter;
