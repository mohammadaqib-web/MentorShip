const express = require('express');
const { addUser, loginUser, verifyOTP, resendOTPVerificationCode } = require('../controllers/user_controller');
const router = express.Router();

router.post('/addUser',addUser);
router.post('/verifyOTP',verifyOTP);
router.post('/resendOTP',resendOTPVerificationCode);
router.post('/loginUser',loginUser);

module.exports = router;