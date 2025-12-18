const express = require('express');
const router = express.Router();
const { registerStudent, login, getMe, registerTeacher } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerStudent);
router.post('/register-teacher', registerTeacher);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
