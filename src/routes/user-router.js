import express from 'express';
import {
  getUsers,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.get('/', getUsers); // Hakee kaikki käyttäjät
userRouter.get('/:id', getUserById); // Hakee käyttäjän ID:n perusteella
userRouter.post('/', postUser); // Lisää uuden käyttäjän
userRouter.put('/:id', putUser); // Päivittää käyttäjän
userRouter.delete('/:id', deleteUser); // Poistaa käyttäjän

export default userRouter;
