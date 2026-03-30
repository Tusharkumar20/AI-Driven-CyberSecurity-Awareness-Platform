const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, updateProfile, addXP } = require('../controllers/profileControllers');

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);
router.post('/xp', auth, addXP);

module.exports = router;