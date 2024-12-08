import promisePool from '../utils/database.js';

// Tarkistaa, että käyttäjä omistaa mediaresurssin
export const verifyMediaOwnership = async (req, res, next) => {
  const mediaId = parseInt(req.params.id, 10);
  const userId = req.user?.id; // Kirjautuneen käyttäjän ID tokenista

  if (isNaN(mediaId)) {
    return res.status(400).json({ message: 'Invalid media ID' });
  }

  try {
    const sql = 'SELECT user_id FROM MediaItems WHERE media_id = ?';
    const [rows] = await promisePool.query(sql, [mediaId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Media item not found' });
    }

    if (rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }

    next(); // Käyttäjä omistaa resurssin, jatka
  } catch (error) {
    console.error('verifyMediaOwnership', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Tarkistaa, että käyttäjä omistaa käyttäjäresurssin
export const verifyUserOwnership = async (req, res, next) => {
  const userId = parseInt(req.params.id, 10); // Käyttäjän ID
  const authenticatedUserId = req.user?.id; // Tokenista saatu ID

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    if (userId !== authenticatedUserId) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }

    next(); // Käyttäjä omistaa resurssin, jatka
  } catch (error) {
    console.error('verifyUserOwnership', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
