import {
  fetchUsers,
  fetchUserById,
  addUser,
  updateUser,
  authenticateUser,
  deleteUser as deleteUserModel, // Uudelleennimeäminen konfliktien välttämiseksi
} from '../models/user-model.js';

const getUsers = async (req, res) => {
  try {
    res.json(await fetchUsers());
  } catch (e) {
    console.error('getUsers', e.message);
    res.status(503).json({error: 503, message: 'DB error'});
  }
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10); // Muuntaa ID:n kokonaisluvuksi
  if (isNaN(id)) {
    return res.status(400).json({message: 'Invalid ID'});
  }
  try {
    const user = await fetchUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({message: 'User not found'});
    }
  } catch (e) {
    console.error('getUserById', e.message);
    res.status(503).json({error: 503, message: e.message});
  }
};

const postUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const id = await addUser({
      username,
      email,
      password,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });
    res.status(201).json({ message: 'User added', id });
  } catch (error) {
    console.error('postUser Error:', error.message);
    next(error); // Käytä error-handleria
  }
  console.log('postUser called with:', req.body);

};


const putUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({message: 'Invalid ID'});
  }
  
  // Tarkista, onko käyttäjä oikeutettu päivittämään omia tietojaan
  if (req.user.id !== id) {
    return res.status(403).json({message: 'You can only update your own profile'});
  }

  const {username, email} = req.body;
  if (!username || !email) {
    return res.status(400).json({message: 'Username and email are required'});
  }
  
  try {
    const rowsUpdated = await updateUser(id, {username, email});
    if (rowsUpdated === 0) {
      return res.status(404).json({message: 'User not found'});
    } else {
      return res.status(200).json({message: 'User updated', id});
    }
  } catch (e) {
    console.error('putUser', e.message);
    res.status(500).json({message: 'Something went wrong: ' + e.message});
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login request body:', req.body); // Log req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const user = await fetchUserByEmail(email);
    console.log('Fetched user:', user); // Log the fetched user

    if (!user) {
      console.log('User not found'); // Log if no user is found
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch); // Log password comparison result

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error.message); // Log any errors
    res.status(500).json({ message: 'Something went wrong' });
  }
};
  



const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({message: 'Invalid ID'});
  }
  try {
    const rowsDeleted = await deleteUserModel(id);
    if (rowsDeleted) {
      res.json({message: 'User deleted', id});
    } else {
      res.status(404).json({message: 'User not found'});
    }
  } catch (error) {
    console.error('deleteUser', error.message);
    res.status(503).json({error: 503, message: error.message});
  }
};

export {getUsers, getUserById, postUser, putUser, loginUser, deleteUser};
