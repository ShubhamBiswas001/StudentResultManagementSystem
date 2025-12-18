const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        // Drop the problematic rollNumber index
        try {
            await collection.dropIndex('rollNumber_1');
            console.log('✅ Dropped rollNumber_1 index');
        } catch (error) {
            console.log('Index may not exist:', error.message);
        }

        // Drop studentId index if it exists
        try {
            await collection.dropIndex('studentId_1');
            console.log('✅ Dropped studentId_1 index');
        } catch (error) {
            console.log('studentId index may not exist:', error.message);
        }

        console.log('\n✅ Index cleanup complete!');
        console.log('Restart your server to recreate indexes properly.');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixIndexes();
