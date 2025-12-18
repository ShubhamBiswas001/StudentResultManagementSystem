const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
}).single('profilePicture');

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Teacher only)
exports.getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');

        res.status(200).json({
            success: true,
            count: students.length,
            students
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id).select('-password');

        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({
            success: true,
            student
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update student profile
// @route   PUT /api/students/:id
// @access  Private
exports.updateStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        const { name, class: className, section, rollNumber } = req.body;

        if (name) student.name = name;
        if (className) student.class = className;
        if (section) student.section = section;
        if (rollNumber) student.rollNumber = rollNumber;

        await student.save();

        res.status(200).json({
            success: true,
            student
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Upload student profile picture
// @route   POST /api/students/:id/upload
// @access  Private
exports.uploadProfilePicture = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const student = await User.findById(req.params.id);

            if (!student || student.role !== 'student') {
                return res.status(404).json({ message: 'Student not found' });
            }

            student.profilePicture = `/uploads/${req.file.filename}`;
            await student.save();

            res.status(200).json({
                success: true,
                profilePicture: student.profilePicture
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
};

module.exports.upload = upload;
