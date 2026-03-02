const admin = require('../config/firebase');
const db = require('../db');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    // Firebase verifies the token
    const decoded = await admin.auth().verifyIdToken(token);
    
    // Check if user exists in your DB, if not create them
    let result = await db.query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      [decoded.uid]
    );

    if (result.rows.length === 0) {
      // First time login — auto-create user + profile
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

    req.user = result.rows[0]; // attach DB user to request
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};