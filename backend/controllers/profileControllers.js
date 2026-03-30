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

exports.addXP = async (req, res) => {
  const { xp } = req.body;
  try {
    await db.query(
      'UPDATE player_profiles SET xp = xp + $1 WHERE user_id = $2',
      [xp, req.user.id]
    );
    const result = await db.query(
      'SELECT xp FROM player_profiles WHERE user_id = $1',
      [req.user.id]
    );
    res.json({ xp: result.rows[0].xp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { username, avatar_url, xp } = req.body;
  try {
    await db.query(
      `UPDATE player_profiles 
       SET username = COALESCE($1, username), 
           avatar_url = COALESCE($2, avatar_url),
           xp = COALESCE($3, xp)
       WHERE user_id = $4`,
      [username, avatar_url, xp, req.user.id]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};