const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileControllers');

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);

module.exports = router;