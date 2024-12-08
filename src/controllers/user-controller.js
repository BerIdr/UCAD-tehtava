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

const postUser = async (req, res) => {
  const {username, email, password} = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({message: 'Username, email, and password required'});
  }
  try {
    const id = await addUser({
      username,
      email,
      password,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),

    });
    res.status(201).json({message: 'User added', id});
  } catch (e) {
    console.error('postUser', e.message);
    res.status(400).json({message: 'Something went wrong: ' + e.message});
  }
};

const putUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({message: 'Invalid ID'});
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
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).json({message: 'Email and password required'});
  }
  try {
    const user = await authenticateUser(email, password);
    if (user) {
      res.status(200).json({message: 'Login successful', user});
    } else {
      res.status(401).json({message: 'Invalid credentials'});
    }
  } catch (e) {
    console.error('loginUser', e.message);
    res.status(503).json({error: 503, message: e.message});
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