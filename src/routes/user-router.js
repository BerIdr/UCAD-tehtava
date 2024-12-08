import express from 'express';
import {
  getUsers,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';
import { verifyUserOwnership } from '../utils/auth-ownership.js';
import { authenticateToken } from '../utils/auth-middleware.js';

const userRouter = express.Router();

userRouter.get('/', getUsers); // Public
userRouter.get('/:id', authenticateToken, getUserById); // Protected
userRouter.post('/', postUser); // Public
userRouter.put('/:id', authenticateToken, verifyUserOwnership, putUser); // Protected
userRouter.delete('/:id', authenticateToken, verifyUserOwnership, deleteUser); // Protected

export default userRouter;
