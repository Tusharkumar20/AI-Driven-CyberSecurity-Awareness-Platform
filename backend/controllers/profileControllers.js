const db = require('../db');

exports.getProfile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM player_profiles WHERE user_id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { username, avatar_url } = req.body;
  try {
    await db.query(
      'UPDATE player_profiles SET username = $1, avatar_url = $2 WHERE user_id = $3',
      [username, avatar_url, req.user.id]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};