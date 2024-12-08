import jwt from 'jsonwebtoken';

const protectRoute = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Invalid token:', err);
      return res.status(403).json({ message: 'Invalid token.' });
    }

    // Attach user information to the request object for downstream use
    req.user = user;
    next();
  });
};

export default protectRoute;
