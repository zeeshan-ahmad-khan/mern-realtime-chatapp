const router = require('express').Router();
const { registerUser, loginUser, getAllUsers } = require('../controllers/authControllers');
const protect = require('../middlewares/authMiddleware')

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/getAllUsers').get(protect, getAllUsers)

module.exports = router;