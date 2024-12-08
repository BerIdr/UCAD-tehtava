import express from 'express';
import multer from 'multer';
import {
  getItemById,
  getItems,
  postItem,
  putItem,
  deleteItem,
} from '../controllers/media-controller.js';

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

const mediaRouter = express.Router();

// GET all media items or POST a new media item (with file upload)
mediaRouter.route('/').get(getItems).post(upload.single('file'), postItem);

// GET, PUT, DELETE a specific media item by ID
mediaRouter.route('/:id').get(getItemById).put(putItem).delete(deleteItem);

export default mediaRouter;
