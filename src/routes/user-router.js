import express from 'express';
import { check, validationResult } from 'express-validator';
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

// Validointisäännöt
const userValidationRules = [
  check('username')
    .isString()
    .withMessage('Username must be a string')
    .notEmpty()
    .withMessage('Username is required'),
  check('email')
    .isEmail()
    .withMessage('Invalid email format'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Tarkista validointi ja lähetä virheet, jos niitä on
const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Reitit
userRouter.get('/', getUsers); // Public
userRouter.get('/:id', authenticateToken, getUserById); // Protected

// POST: Käyttäjän lisääminen (validointi mukana)
userRouter.post('/', (req, res, next) => {
  console.log('POST /api/users called with body:', req.body);
  next();
}, userValidationRules, validateInput, postUser);

// PUT: Käyttäjän päivittäminen (validointi mukana)
userRouter.put(
  '/:id',
  authenticateToken,
  verifyUserOwnership,
  userValidationRules,
  validateInput,
  putUser
); // Protected

// DELETE: Käyttäjän poistaminen
userRouter.delete('/:id', authenticateToken, verifyUserOwnership, deleteUser); // Protected

export default userRouter;
