import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fetchUserByEmail } from '../models/user-model.js';

const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
  
    try {
      const user = await authenticateUser(email, password);
      console.log('User from DB:', user);
  
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isMatch);
  
        if (isMatch) {
          const token = jwt.sign(
            { userId: user.user_id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
          );
          return res.status(200).json({ message: 'Login successful', token });
        } else {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login Error:', error.message);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  

export default loginUser;
