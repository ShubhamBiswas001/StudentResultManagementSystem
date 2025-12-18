const Result = require('../models/Result');
const User = require('../models/User');

// @desc    Create a new result
// @route   POST /api/results
// @access  Private (Teacher only)
exports.createResult = async (req, res) => {
    try {
        const { studentId, examName, examDate, subjects, remarks } = req.body;

        // Find student
        const student = await User.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        let resultData = {
            student: studentId,
            examName,
            examDate,
            remarks,
            subjects: [],
            totalMarks: 0,
            percentage: '0',
            overallGrade: 'N/A'
        };

        if (req.file) {
            resultData.pdfPath = req.file.filename;
        }

        // Only process subjects if they exist and are valid
        if (req.body.subjects) {
            try {
                const subjects = typeof req.body.subjects === 'string' ? JSON.parse(req.body.subjects) : req.body.subjects;
                if (Array.isArray(subjects) && subjects.length > 0) {
                    resultData.subjects = subjects;
                    const totalMarks = subjects.reduce((acc, curr) => acc + (parseFloat(curr.marksObtained) || 0), 0);
                    const maxMarks = subjects.reduce((acc, curr) => acc + (parseFloat(curr.totalMarks) || 100), 0);
                    const percentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : '0';

                    resultData.totalMarks = totalMarks;
                    resultData.percentage = percentage;

                    let grade = 'F';
                    if (percentage >= 90) grade = 'A+';
                    else if (percentage >= 80) grade = 'A';
                    else if (percentage >= 70) grade = 'B+';
                    else if (percentage >= 60) grade = 'B';
                    else if (percentage >= 50) grade = 'C+';
                    else if (percentage >= 40) grade = 'C';
                    else if (percentage >= 33) grade = 'D';

                    resultData.overallGrade = grade;
                }
            } catch (e) {
                console.error("Error parsing subjects:", e);
                // Proceed without subjects
            }
        }

        // Create result
        const result = await Result.create({
            ...resultData,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all results
// @route   GET /api/results
// @access  Private (Teacher only)
exports.getAllResults = async (req, res) => {
    try {
        const results = await Result.find()
            .populate('student', 'name studentId class section rollNumber')
            .populate('createdBy', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: results.length,
            results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get student's results
// @route   GET /api/results/student/:studentId
// @access  Private
exports.getStudentResults = async (req, res) => {
    try {
        const studentId = req.params.studentId || req.user.id;

        const results = await Result.find({ student: studentId })
            .populate('student', 'name studentId class section rollNumber')
            .sort('-examDate');

        res.status(200).json({
            success: true,
            count: results.length,
            results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single result
// @route   GET /api/results/:id
// @access  Private
exports.getResult = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate('student', 'name studentId class section rollNumber')
            .populate('createdBy', 'name email');

        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update result
// @route   PUT /api/results/:id
// @access  Private (Teacher only)
exports.updateResult = async (req, res) => {
    try {
        let result = await Result.findById(req.params.id);

        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        const { examName, examDate, subjects, remarks } = req.body;

        // Recalculate if subjects are updated
        if (subjects) {
            let totalMarks = 0;
            let marksObtained = 0;

            subjects.forEach(subject => {
                totalMarks += subject.totalMarks;
                marksObtained += subject.marksObtained;
            });

            const percentage = (marksObtained / totalMarks) * 100;

            let overallGrade;
            if (percentage >= 90) overallGrade = 'A+';
            else if (percentage >= 80) overallGrade = 'A';
            else if (percentage >= 70) overallGrade = 'B+';
            else if (percentage >= 60) overallGrade = 'B';
            else if (percentage >= 50) overallGrade = 'C+';
            else if (percentage >= 40) overallGrade = 'C';
            else if (percentage >= 33) overallGrade = 'D';
            else overallGrade = 'F';

            result.subjects = subjects;
            result.totalMarks = totalMarks;
            result.marksObtained = marksObtained;
            result.percentage = percentage.toFixed(2);
            result.overallGrade = overallGrade;
        }

        if (examName) result.examName = examName;
        if (examDate) result.examDate = examDate;
        if (remarks !== undefined) result.remarks = remarks;

        await result.save();

        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete result
// @route   DELETE /api/results/:id
// @access  Private (Teacher only)
exports.deleteResult = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);

        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        await result.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Result deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
