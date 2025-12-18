const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Register student
// @route   POST /api/auth/register
// @access  Public
exports.registerStudent = async (req, res) => {
    try {
        const { name, password, rollNumber, dateOfBirth } = req.body;

        // Check if student already exists
        const existingStudent = await User.findOne({ rollNumber });
        if (existingStudent) {
            return res.status(400).json({ message: 'Roll Number already exists' });
        }

        // Create student
        const student = await User.create({
            name,
            password,
            role: 'student',
            rollNumber,
            dateOfBirth
        });

        // Generate token
        const token = generateToken(student._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: student._id,
                name: student.name,
                studentId: student.studentId,
                role: student.role,
                class: student.class,
                section: student.section,
                rollNumber: student.rollNumber
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Register teacher
// @route   POST /api/auth/register-teacher
// @access  Public
exports.registerTeacher = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('Register Teacher Request:', { name, email, hasPassword: !!password });

        // Check if teacher already exists
        const existingTeacher = await User.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create teacher
        const teacher = await User.create({
            name,
            email,
            password,
            role: 'teacher'
        });

        console.log('Teacher created successfully:', teacher._id);

        // Generate token
        const token = generateToken(teacher._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                role: teacher.role
            }
        });
    } catch (error) {
        console.error('Register Teacher Error:', error);
        console.error('Error Stack:', error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Login user (student or teacher)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { identifier, password, role } = req.body;

        // Validate input
        if (!identifier || !password || !role) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Find user based on role
        let user;
        if (role === 'student') {
            user = await User.findOne({ rollNumber: identifier, role: 'student' }).select('+password');
        } else if (role === 'teacher') {
            user = await User.findOne({ email: identifier, role: 'teacher' }).select('+password');
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                studentId: user.studentId,
                role: user.role,
                class: user.class,
                section: user.section,
                rollNumber: user.rollNumber
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
