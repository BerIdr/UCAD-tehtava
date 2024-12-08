import express from 'express';
import {
  getComments,
  getCommentById,
  postComment,
} from '../controllers/comments-controller.js';

const commentsRouter = express.Router();

commentsRouter.route('/').get(getComments).post(postComment);

commentsRouter.route('/:id').get(getCommentById);

export default commentsRouter;
