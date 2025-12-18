# Student Result Management System

A comprehensive full-stack web application for managing student examination results with role-based access control, real-time updates, and PDF result management.

## Overview

This system provides a complete solution for educational institutions to manage student results digitally. It features separate interfaces for teachers and students, with real-time notifications, PDF result uploads, and comprehensive result tracking capabilities.

## Key Features

### Student Portal
- **Secure Authentication**: Student ID-based login with encrypted password storage
- **Result Viewing**: Access all examination results with subject-wise breakdown
- **Performance Tracking**: View grades, percentages, and overall performance metrics
- **Real-time Updates**: Instant notifications when new results are published
- **Profile Management**: Update personal information and profile picture
- **PDF Downloads**: Access and download result PDFs when available

### Teacher Portal
- **Comprehensive Dashboard**: Overview of all students and their performance
- **Result Management**: Create, edit, and delete student examination results
- **Student Management**: View and manage student profiles
- **PDF Upload**: Attach PDF result documents to examination records
- **Real-time Publishing**: Instant result publication with student notifications
- **Bulk Operations**: Manage multiple students and results efficiently
- **Teacher Registration**: Self-registration capability for new teachers

### Administrative Features
- **Role-based Access Control**: Separate permissions for students and teachers
- **Data Validation**: Comprehensive input validation and error handling
- **Audit Trail**: Track result creation and modification timestamps
- **Secure File Storage**: Safe handling of uploaded profile pictures and PDFs

## Technology Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite 7** - Next-generation frontend build tool
- **TailwindCSS 4** - Utility-first CSS framework
- **Material-UI 7** - React component library
- **React Router 7** - Client-side routing
- **Axios** - HTTP client for API communication
- **Socket.IO Client** - Real-time bidirectional communication
- **SweetAlert2** - Beautiful, responsive alert dialogs
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 9** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Multer 2** - File upload middleware
- **Socket.IO** - Real-time event-based communication
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **Nodemon** - Auto-restart development server
- **Concurrently** - Run multiple commands simultaneously
- **ESLint** - Code linting and quality
- **PostCSS** - CSS transformation

## System Requirements

- **Node.js**: v16.0.0 or higher
- **MongoDB**: v4.4 or higher
- **npm**: v7.0.0 or higher
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## Installation Guide

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd StudentResultManagementSystem
```

### 2. Install Dependencies

**Install root dependencies:**
```bash
cd User
npm install
```

**Install backend dependencies:**
```bash
cd server
npm install
cd ..
```

**Install frontend dependencies:**
```bash
cd client
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in `User/server/` directory (or use the existing one):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_result_system
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRE=7d
```

> **Security Note**: Replace `JWT_SECRET` with a strong, random string in production environments.

### 4. Database Setup

Ensure MongoDB is installed and running:

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 5. Seed Initial Data

Create the default teacher account:

```bash
cd User/server
npm run seed
```

**Default Teacher Credentials:**
- Email: `teacher@school.com`
- Password: `teacher123`

> **Important**: Change these credentials after first login in production.

## Running the Application

### Development Mode (Recommended)

Run both frontend and backend concurrently:

```bash
cd User
npm run dev
```

This starts:
- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:5173

### Production Mode

**Build frontend:**
```bash
cd User/client
npm run build
```

**Start backend:**
```bash
cd User/server
npm start
```

### Separate Terminals

**Terminal 1 - Backend:**
```bash
cd User/server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd User/client
npm run dev
```

## Usage Guide

### First-Time Setup

1. **Access the Application**: Navigate to `http://localhost:5173`

2. **Teacher Registration** (Optional):
   - Click "Register as Teacher"
   - Fill in name, email, and password
   - Login with new credentials

3. **Teacher Login**:
   - Toggle to "Teacher" mode
   - Email: `teacher@school.com`
   - Password: `teacher123`

4. **Student Registration**:
   - Click "Register here"
   - Provide required information:
     - Full Name
     - Unique Student ID (e.g., STU2024001)
     - Roll Number
     - Class and Section
     - Date of Birth
     - Password (minimum 6 characters)

5. **Student Login**:
   - Toggle to "Student" mode
   - Enter Student ID and password

### Teacher Workflow

1. **Add Results**:
   - Click "Add New Result"
   - Select student from dropdown
   - Enter exam name and date
   - Add subject-wise marks
   - Optionally upload PDF result
   - Submit to publish

2. **Edit Results**:
   - Click edit icon on any result
   - Modify details as needed
   - Save changes

3. **Delete Results**:
   - Click delete icon
   - Confirm deletion

4. **View Students**:
   - Access student list from dashboard
   - View individual student profiles

### Student Workflow

1. **View Results**:
   - Dashboard displays all published results
   - View subject-wise breakdown
   - Check overall grades and percentages

2. **Download PDFs**:
   - Click PDF link if available
   - Download result document

3. **Update Profile**:
   - Upload profile picture
   - Update personal information

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new student | Public |
| POST | `/api/auth/register-teacher` | Register new teacher | Public |
| POST | `/api/auth/login` | Login (student/teacher) | Public |
| GET | `/api/auth/me` | Get current user info | Protected |

### Student Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/students` | Get all students | Teacher |
| GET | `/api/students/:id` | Get single student | Protected |
| PUT | `/api/students/:id` | Update student info | Protected |
| POST | `/api/students/:id/upload` | Upload profile picture | Protected |

### Result Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/results` | Create new result (with PDF) | Teacher |
| GET | `/api/results` | Get all results | Teacher |
| GET | `/api/results/:id` | Get single result | Protected |
| GET | `/api/results/student/:studentId` | Get student's results | Protected |
| PUT | `/api/results/:id` | Update result | Teacher |
| DELETE | `/api/results/:id` | Delete result | Teacher |

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique, for teachers),
  studentId: String (unique, for students),
  password: String (hashed),
  role: String (enum: 'student', 'teacher'),
  class: String,
  section: String,
  rollNumber: String (unique),
  dateOfBirth: Date,
  profilePicture: String,
  createdAt: Date
}
```

### Result Model
```javascript
{
  student: ObjectId (ref: User),
  examName: String,
  examDate: Date,
  pdfPath: String,
  subjects: [{
    name: String,
    marksObtained: Number,
    totalMarks: Number,
    grade: String
  }],
  totalMarks: Number,
  percentage: String,
  overallGrade: String,
  remarks: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure

```
StudentResultManagementSystem/
├── User/
│   ├── client/                      # React Frontend
│   │   ├── public/                  # Static assets
│   │   ├── src/
│   │   │   ├── components/          # Reusable components
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── context/             # React Context
│   │   │   │   └── AuthContext.jsx
│   │   │   ├── pages/               # Page components
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── RegisterTeacher.jsx
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   └── TeacherDashboard.jsx
│   │   │   ├── services/            # API services
│   │   │   │   └── api.js
│   │   │   ├── App.jsx
│   │   │   ├── main.jsx
│   │   │   └── index.css
│   │   ├── .env                     # Frontend environment variables
│   │   ├── eslint.config.js
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.js
│   │   └── vite.config.js
│   ├── server/                      # Node.js Backend
│   │   ├── controllers/             # Business logic
│   │   │   ├── authController.js
│   │   │   ├── resultController.js
│   │   │   └── studentController.js
│   │   ├── middleware/              # Custom middleware
│   │   │   └── auth.js
│   │   ├── models/                  # Database models
│   │   │   ├── Result.js
│   │   │   └── User.js
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.js
│   │   │   ├── results.js
│   │   │   └── students.js
│   │   ├── uploads/                 # File storage
│   │   ├── .env                     # Backend environment variables
│   │   ├── .env.example
│   │   ├── fixIndexes.js            # Database utility
│   │   ├── package.json
│   │   ├── seedTeacher.js           # Seed script
│   │   └── server.js                # Entry point
│   └── package.json                 # Root package.json
├── Admin/                           # Admin module (future)
├── .gitignore
└── README.md
```

## Grading System

The application uses a standard percentage-based grading scale:

| Grade | Percentage Range |
|-------|------------------|
| A+ | 90% - 100% |
| A | 80% - 89% |
| B+ | 70% - 79% |
| B | 60% - 69% |
| C+ | 50% - 59% |
| C | 40% - 49% |
| D | 33% - 39% |
| F | Below 33% |

Grades are automatically calculated based on marks obtained and total marks for each subject.

## Security Features

- **Authentication**: JWT-based stateless authentication
- **Password Security**: bcrypt hashing with salt rounds
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured cross-origin resource sharing
- **File Upload Security**: Multer with file type and size restrictions
- **Environment Variables**: Sensitive data stored in .env files
- **Protected Routes**: Frontend and backend route protection
- **Password Requirements**: Minimum 6 characters enforced

## Real-time Features

The application uses Socket.IO for real-time communication:

- **Instant Notifications**: Students receive immediate alerts when results are published
- **Live Updates**: Dashboard updates without page refresh
- **Connection Management**: Automatic reconnection handling
- **Event Broadcasting**: Server-to-client event emission

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Verify connection string in .env
MONGODB_URI=mongodb://localhost:27017/student_result_system
```

### Port Conflicts
```bash
# Backend port (default: 5000)
# Change in User/server/.env
PORT=5001

# Frontend port (default: 5173)
# Change in User/client/vite.config.js
```

### Dependency Issues
```bash
# Clear all node_modules and reinstall
cd User
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
rm -rf server/node_modules server/package-lock.json

npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### File Upload Errors
- Ensure `uploads/` directory exists in `User/server/`
- Check file permissions
- Verify Multer configuration

### Authentication Errors
- Clear browser localStorage
- Verify JWT_SECRET is set in .env
- Check token expiration settings

## Development Guidelines

### Code Style
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error handling
- Add meaningful comments

### Git Workflow
- Create feature branches
- Write descriptive commit messages
- Test before committing
- Keep commits atomic

### Testing
- Test all API endpoints
- Verify authentication flows
- Check file upload functionality
- Test real-time updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC License

## Acknowledgments

Built with modern web technologies and best practices for educational result management.
