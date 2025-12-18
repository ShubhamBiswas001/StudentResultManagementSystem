# Student Result Management System

A modern, full-stack web application for managing student results with role-based access for teachers and students.

## Features

### For Students
- 📝 Register and create account
- 🔐 Secure login with Student ID
- 📊 View exam results and grades
- 📈 Track academic performance
- 🎯 View subject-wise marks and grades

### For Teachers
- 🔐 Secure login with email
- 👥 Manage student results
- ➕ Add new exam results
- ✏️ Edit existing results
- 🗑️ Delete results
- 📊 View all students and their performance
- 📈 Dashboard with statistics

## Technology Stack

### Frontend
- **React** with Vite
- **TailwindCSS** for styling
- **Material-UI** for components
- **Lucide React** for icons
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (running locally or connection string)
- **npm** or **yarn**

## Installation

### 1. Clone the repository (if applicable)
```bash
cd StudentResultManagementSystem
```

### 2. Install dependencies

Install root dependencies:
```bash
cd User
npm install
```

Install server dependencies:
```bash
cd server
npm install
cd ..
```

Install client dependencies:
```bash
cd client
npm install
cd ..
```

### 3. Configure Environment Variables

The server `.env` file is already created at `User/server/.env` with default values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_result_system
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

**Important:** Change `JWT_SECRET` to a secure random string in production.

### 4. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# MongoDB should be running as a service
# Or start it manually:
mongod
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# Or
brew services start mongodb-community
```

### 5. Seed Teacher Account

Create a default teacher account:

```bash
cd User/server
npm run seed
cd ../..
```

This creates a teacher account with:
- **Email:** teacher@school.com
- **Password:** teacher123

## Running the Application

### Option 1: Run Both Frontend and Backend Together (Recommended)

From the User directory:

```bash
cd User
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend on `http://localhost:5173`

### Option 2: Run Separately

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

## Usage

### 1. Access the Application

Open your browser and navigate to: `http://localhost:5173`

### 2. Teacher Login

- Click on "Teacher" toggle
- Email: `teacher@school.com`
- Password: `teacher123`

### 3. Student Registration

- Click on "Register here"
- Fill in the registration form
- Use a unique Student ID (e.g., STU2024001)
- Choose class and section
- Create a password (minimum 6 characters)

### 4. Student Login

- Click on "Student" toggle
- Enter your Student ID
- Enter your password

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register student
- `POST /api/auth/login` - Login (student/teacher)
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students` - Get all students (Teacher only)
- `GET /api/students/:id` - Get single student
- `PUT /api/students/:id` - Update student
- `POST /api/students/:id/upload` - Upload profile picture

### Results
- `POST /api/results` - Create result (Teacher only)
- `GET /api/results` - Get all results (Teacher only)
- `GET /api/results/student/:studentId` - Get student results
- `GET /api/results/:id` - Get single result
- `PUT /api/results/:id` - Update result (Teacher only)
- `DELETE /api/results/:id` - Delete result (Teacher only)

## Project Structure

```
StudentResultManagementSystem/
├── User/                      # Main application directory
│   ├── client/               # React frontend
│   │   ├── src/
│   │   │   ├── components/   # Reusable components
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── pages/       # Page components
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   └── TeacherDashboard.jsx
│   │   │   ├── context/     # Context providers
│   │   │   │   └── AuthContext.jsx
│   │   │   ├── services/    # API services
│   │   │   │   └── api.js
│   │   │   ├── App.jsx
│   │   │   ├── main.jsx
│   │   │   └── index.css
│   │   ├── package.json
│   │   ├── tailwind.config.js
│   │   └── vite.config.js
│   ├── server/              # Node.js backend
│   │   ├── models/          # MongoDB models
│   │   │   ├── User.js
│   │   │   └── Result.js
│   │   ├── routes/          # API routes
│   │   │   ├── auth.js
│   │   │   ├── students.js
│   │   │   └── results.js
│   │   ├── controllers/     # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── studentController.js
│   │   │   └── resultController.js
│   │   ├── middleware/      # Custom middleware
│   │   │   └── auth.js
│   │   ├── uploads/         # Uploaded files
│   │   ├── server.js
│   │   ├── seedTeacher.js
│   │   ├── .env
│   │   └── package.json
│   └── package.json         # Root package.json for User
├── Admin/                    # Admin directory (if applicable)
└── README.md                 # This file

```

## Grading System

The system uses the following grading scale:

- **A+**: 90% and above
- **A**: 80% - 89%
- **B+**: 70% - 79%
- **B**: 60% - 69%
- **C+**: 50% - 59%
- **C**: 40% - 49%
- **D**: 33% - 39%
- **F**: Below 33%

## Default Subjects

When creating a result, the system includes these default subjects:
- Mathematics
- Science
- English
- Social Studies
- Computer

Teachers can modify subject names and add/remove subjects as needed.

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes with role-based access control
- Secure HTTP headers with CORS
- Input validation

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify MongoDB is accessible on port 27017

### Port Already in Use
- Backend: Change `PORT` in `User/server/.env`
- Frontend: Change port in `User/client/vite.config.js`

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Future Enhancements

- [ ] PDF report generation
- [ ] Email notifications
- [ ] Attendance tracking
- [ ] Parent portal
- [ ] Analytics and charts
- [ ] Bulk result upload via CSV
- [ ] Mobile responsive improvements

## License

ISC

## Support

For issues or questions, please create an issue in the repository or contact the development team.
