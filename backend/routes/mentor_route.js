const express = require('express');
const authenticate = require('../middlewares/protectedRoute');
const mentorAuthenticate = require('../middlewares/mentorProtectedRoute');
const upload = require('../middlewares/uploadRoute');
const { editMentorProfile, updateMentorCoordinates, getAllMentors, getMentorsBySearch } = require('../controllers/user_controller');
const router = express.Router();

router.post('/updateData',authenticate,mentorAuthenticate,upload.single('image'),editMentorProfile);
router.get('/allMentors',getAllMentors);
router.get('/searchMentor',getMentorsBySearch);

module.exports = router;