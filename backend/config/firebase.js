const admin = require('firebase-admin');

if (admin.apps.length === 0) {
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    credential = admin.credential.cert(serviceAccount);
    admin.initializeApp({ credential });
  } else {
    try {
      const serviceAccount = require('../cybersecurity-platform-ca087-firebase-adminsdk-fbsvc-abf58d9ed2.json');
      credential = admin.credential.cert(serviceAccount);
      admin.initializeApp({ credential });
    } catch (e) {
      console.warn('Firebase Admin SDK: No service account found. Set FIREBASE_SERVICE_ACCOUNT_JSON secret to enable auth.');
      admin.initializeApp();
    }
  }
}

module.exports = admin;
