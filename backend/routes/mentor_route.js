const express = require('express');
const authenticate = require('../middlewares/protectedRoute');
const mentorAuthenticate = require('../middlewares/mentorProtectedRoute');
const upload = require('../middlewares/uploadRoute');
const { editMentorProfile, getAllMentors, getMentorsBySearch, createSlot, getMentorProfile, getProfileMentor } = require('../controllers/user_controller');
const router = express.Router();

router.post('/updateData',authenticate,mentorAuthenticate,upload.single('image'),editMentorProfile);
router.get('/allMentors',getAllMentors);
router.post('/searchMentor',getMentorsBySearch);
router.post('/createSlot',authenticate,mentorAuthenticate,createSlot);
router.get('/profile',authenticate,mentorAuthenticate,getProfileMentor);
router.get('/:id',getMentorProfile);

module.exports = router;