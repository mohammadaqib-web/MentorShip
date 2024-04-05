const express = require('express');
const authenticate = require('../middlewares/protectedRoute');
const { chat, getChat } = require('../controllers/user_controller');
const router = express.Router();

router.post('/sendChat/:id',authenticate,chat);
router.get('/getChat/:id',authenticate,getChat);

module.exports = router;