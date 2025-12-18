const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedTeacher = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student_result_system');

        console.log('MongoDB connected');

        // Check if teacher already exists
        const existingTeacher = await User.findOne({ email: 'teacher@school.com' });

        if (existingTeacher) {
            console.log('Teacher account already exists!');
            console.log('Email: teacher@school.com');
            console.log('Password: teacher123');
            process.exit(0);
        }

        // Create teacher account
        const teacher = await User.create({
            name: 'John Doe',
            email: 'teacher@school.com',
            password: 'teacher123',
            role: 'teacher'
        });

        console.log('Teacher account created successfully!');
        console.log('Email: teacher@school.com');
        console.log('Password: teacher123');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedTeacher();
