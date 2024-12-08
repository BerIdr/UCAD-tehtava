import express from 'express';
import multer from 'multer';
import {
  getItemById,
  getItems,
  postItem,
  putItem,
  deleteItem,
} from '../controllers/media-controller.js';
import { verifyMediaOwnership } from '../utils/auth-ownership.js';
import { authenticateToken } from '../utils/auth-middleware.js';

const upload = multer({ dest: 'uploads/' });

const mediaRouter = express.Router();

mediaRouter.route('/')
  .get(getItems)
  .post(authenticateToken, upload.single('file'), postItem);

mediaRouter.route('/:id')
  .get(getItemById)
  .put(authenticateToken, verifyMediaOwnership, putItem) // Protected
  .delete(authenticateToken, verifyMediaOwnership, deleteItem); // Protected

export default mediaRouter;
