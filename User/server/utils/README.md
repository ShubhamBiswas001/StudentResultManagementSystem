# Server Utilities

This folder contains utility scripts for database maintenance and setup.

## Scripts

### seedTeacher.js
Seeds the database with a default teacher account for initial setup.

**Usage:**
```bash
npm run seed
```

**Default credentials:**
- Email: teacher@school.com
- Password: teacher123

### fixIndexes.js
Fixes MongoDB index issues by dropping and recreating problematic indexes (rollNumber, studentId, email).

**Usage:**
```bash
node utils/fixIndexes.js
```

**When to use:**
- Getting duplicate key errors even when data doesn't exist
- After changing the User model schema
- When experiencing index-related database errors

**Note:** Restart the server after running this script to recreate indexes properly.
