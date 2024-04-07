const express = require('express');
const { addUser, loginUser, verifyOTP, resendOTPVerificationCode, verifyEmail, getUser } = require('../controllers/user_controller');
const router = express.Router();

router.post('/addUser',addUser);
router.post('/verifyOTP',verifyOTP);
router.post('/resendOTP',resendOTPVerificationCode);
router.post('/loginUser',loginUser);
router.post('/verifyEmail',verifyEmail);
router.get('/getUser/:id',getUser);

module.exports = router;