import express from 'express';
import commentsRouter from './routes/comments-router.js';
import likesRouter from './routes/likes-router.js';
import mediaRouter from './routes/media-router.js';
import ratingsRouter from './routes/ratings-router.js';
import userRouter from './routes/user-router.js';
import authRouter from './routes/auth-router.js';
import protectRoute from './utils/protect-route.js';
import errorHandler from './middlewares/error-handler.js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API. Use /api/users, /api/auth, etc.');
});

// Routes
app.use('/api/auth', authRouter); // Auth route
app.use('/api/comments', commentsRouter);
app.use('/api/likes', likesRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/users', userRouter); // User routes
app.use('/api/media', protectRoute, mediaRouter);

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
