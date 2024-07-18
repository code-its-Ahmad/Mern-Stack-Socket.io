const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { accesschat, fetchchats, creategroupchat, renameGroup, addUserToGroup, removeUserFromGroup } = require('../controller/chatController');
const router = express.Router();

router.route('/').post(protect, accesschat);
router.route('/').get(protect, fetchchats);
router.route('/group').post(protect, creategroupchat);
router.route('/rename').put(protect, renameGroup);
router.route('/remove').put(protect, removeUserFromGroup);
router.route('/add').put(protect, addUserToGroup);

module.exports = router;
