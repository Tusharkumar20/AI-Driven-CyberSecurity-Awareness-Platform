const admin = require('../config/firebase');
const db = require('../db');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    
    let result = await db.query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      [decoded.uid]
    );

    if (result.rows.length === 0) {
      const newUser = await db.query(
        'INSERT INTO users (firebase_uid, email) VALUES ($1, $2) RETURNING id',
        [decoded.uid, decoded.email]
      );
      await db.query(
        'INSERT INTO player_profiles (user_id, username, avatar_url) VALUES ($1, $2, $3)',
        [newUser.rows[0].id, decoded.name || 'CyberAgent', decoded.picture || null]
      );
      result = await db.query('SELECT * FROM users WHERE firebase_uid = $1', [decoded.uid]);
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};