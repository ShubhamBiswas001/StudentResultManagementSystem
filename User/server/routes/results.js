const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController'); // Changed to import the whole object
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer'); // New import
const path = require('path'); // New import

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'result-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }); // New middleware instance

// All routes are protected
router.use(protect);

// Teacher only routes
router.route('/')
    .get(authorize('teacher'), resultController.getAllResults) // Modified to use resultController object
    .post(authorize('teacher', 'admin'), upload.single('pdf'), resultController.createResult); // Added upload middleware and 'admin' role

router.put('/:id', authorize('teacher'), resultController.updateResult); // Modified to use resultController object
router.delete('/:id', authorize('teacher'), resultController.deleteResult); // Modified to use resultController object

// Both student and teacher can access
router.get('/student/:studentId', resultController.getStudentResults);
router.get('/:id', resultController.getResult);

module.exports = router;
