const admin = require('firebase-admin');
const serviceAccount = require('../cybersecurity-platform-ca087-firebase-adminsdk-fbsvc-abf58d9ed2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;