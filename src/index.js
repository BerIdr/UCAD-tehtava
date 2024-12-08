import express from 'express';
import commentsRouter from './routes/comments-router.js';
import likesRouter from './routes/likes-router.js';
import mediaRouter from './routes/media-router.js';
import ratingsRouter from './routes/ratings-router.js';
import userRouter from './routes/user-router.js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/comments', commentsRouter);
app.use('/api/likes', likesRouter);
app.use('/api/media', mediaRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/users', userRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
