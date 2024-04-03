const express = require('express');
const { addUser, loginUser, makeProfile, verifyOTP, resendOTPVerificationCode } = require('../controllers/user_controller');
const authenticate = require('../middlewares/protectedRoute');
const router = express.Router();

router.post('/addUser',addUser);
router.post('/verifyOTP',verifyOTP);
router.post('/resendOTP',resendOTPVerificationCode);
router.post('/loginUser',loginUser);

module.exports = router;