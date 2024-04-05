const express = require('express');
const authenticate = require('../middlewares/protectedRoute');
const mentorAuthenticate = require('../middlewares/mentorProtectedRoute');
const upload = require('../middlewares/uploadRoute');
const { editMentorProfile, getAllMentors, getMentorsBySearch, createSlot, getMentorProfile } = require('../controllers/user_controller');
const router = express.Router();

router.post('/updateData',authenticate,mentorAuthenticate,upload.single('image'),editMentorProfile);
router.get('/allMentors',getAllMentors);
router.get('/searchMentor',getMentorsBySearch);
router.post('/createSlot',authenticate,mentorAuthenticate,createSlot);
router.get('/:id',getMentorProfile);

module.exports = router;