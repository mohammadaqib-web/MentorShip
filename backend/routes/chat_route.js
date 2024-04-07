const express = require('express');
const authenticate = require('../middlewares/protectedRoute');
const { chat, getChat, whomIChatted } = require('../controllers/user_controller');
const router = express.Router();

router.post('/sendChat/:id',authenticate,chat);
router.get('/getChat/:id',authenticate,getChat);
router.get('/chats',authenticate,whomIChatted);

module.exports = router;