import express from 'express';
import {
  getRatings,
  getRatingById,
  postRating,
  getAverageRating,
} from '../controllers/ratings-controller.js';

const ratingsRouter = express.Router();

ratingsRouter.route('/').get(getRatings).post(postRating);

ratingsRouter.route('/:id').get(getRatingById);

ratingsRouter.route('/average/:mediaId').get(getAverageRating);

export default ratingsRouter;
