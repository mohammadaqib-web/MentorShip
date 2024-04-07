const express = require('express');
const authenticate = require('../middlewares/protectedRoute');
const { editMenteeProfile, bookSlot, getMentee } = require('../controllers/user_controller');
const upload = require('../middlewares/uploadRoute');
const menteeAuthenticate = require('../middlewares/menteeProtectedRoute');
const router = express.Router();

router.post('/updateData',authenticate,menteeAuthenticate,upload.single('image'),editMenteeProfile);
router.put('/bookSlot',authenticate,menteeAuthenticate,bookSlot);
router.get('/profile',authenticate,menteeAuthenticate,getMentee);

module.exports = router;