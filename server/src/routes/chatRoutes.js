const router = require('express').Router();
const { getChatDetails, getAllChatMessages, sendMessage } = require('../controllers/chatControllers');
const protect = require('../middlewares/authMiddleware');

router.route('/getChatData').post(protect, getChatDetails)
router.route('/getAllChatMessages').post(protect, getAllChatMessages);
router.route('/sendMessage').post(protect, sendMessage);

module.exports = router;