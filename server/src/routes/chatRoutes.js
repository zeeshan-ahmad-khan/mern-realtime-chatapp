const router = require('express').Router();
const { getChatDetails } = require('../controllers/chatControllers');
const protect = require('../middlewares/authMiddleware');


router.route('/:receiverId/:senderId').get(protect,getChatDetails)

module.exports = router;