const express = require('express');
const router = express.Router();
const {
    getAllStudents,
    getStudent,
    updateStudent,
    uploadProfilePicture
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Teacher only routes
router.get('/', authorize('teacher'), getAllStudents);

// Both student and teacher can access
router.get('/:id', getStudent);
router.put('/:id', updateStudent);
router.post('/:id/upload', uploadProfilePicture);

module.exports = router;
