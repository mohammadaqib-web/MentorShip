const express = require('express');
const authenticate = require('../middlewares/protectedRoute');
const { editMenteeProfile } = require('../controllers/user_controller');
const upload = require('../middlewares/uploadRoute');
const router = express.Router();

router.post('/updateData',authenticate,upload.single('image'),editMenteeProfile);

module.exports = router;