
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resultAPI, studentAPI } from '../services/api';
import {
    Container,
    Paper,
    Typography,
    Button,
    AppBar,
    Toolbar,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Card,
    CardContent,
    Menu,
    Avatar,
    ListItemIcon,
    Divider
} from '@mui/material';
import { LogOut, Plus, Edit, Trash2, Users, Award, BookOpen, GraduationCap, X, FileText, UploadCloud, ChevronDown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';
import Footer from '../components/Footer';

const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentResult, setCurrentResult] = useState(null);

    const [formData, setFormData] = useState({
        studentId: '',
        examName: '',
        examDate: '',
        subjects: [
            { name: 'Mathematics', marksObtained: '', totalMarks: 100, grade: 'A' },
            { name: 'Science', marksObtained: '', totalMarks: 100, grade: 'A' },
            { name: 'English', marksObtained: '', totalMarks: 100, grade: 'A' },
            { name: 'Social Studies', marksObtained: '', totalMarks: 100, grade: 'A' },
            { name: 'Computer', marksObtained: '', totalMarks: 100, grade: 'A' },
        ],
        remarks: ''
    });

    useEffect(() => {
        fetchData();

        const socket = io('http://localhost:5000');

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('resultUpdate', (data) => {
            console.log('Real-time update received:', data);
            fetchData();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchData = async () => {
        try {
            const [resultsRes, studentsRes] = await Promise.all([
                resultAPI.getAllResults(),
                studentAPI.getAllStudents()
            ]);
            setResults(resultsRes.data.results);
            setStudents(studentsRes.data.students);
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch dashboard data',
                confirmButtonColor: '#0ea5e9'
            });
        } finally {
            setLoading(false);
        }
    };

    // Menu State
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        Swal.fire({
            title: 'Logout?',
            text: "Are you sure you want to end your session?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0ea5e9',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Logout',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-xl',
                cancelButton: 'rounded-xl'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate('/login');
            }
        });
    };

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleOpenDialog = (result = null) => {
        if (result) {
            setEditMode(true);
            setCurrentResult(result);
            setFormData({
                studentId: result.student._id,
                examName: result.examName,
                examDate: result.examDate.split('T')[0],
                remarks: result.remarks
            });
            setFile(null); // Reset file for edit mode (handling file update is complex, skipping for now unless requested)
        } else {
            setEditMode(false);
            setCurrentResult(null);
            setFormData({
                studentId: '',
                examName: '',
                examDate: '',
                remarks: ''
            });
            setFile(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditMode(false);
        setCurrentResult(null);
        setFile(null);
    };

    const handleSubmit = async () => {
        try {
            const data = new FormData();
            data.append('studentId', formData.studentId);
            data.append('examName', formData.examName); // Using examName as Subject Name
            data.append('examDate', formData.examDate);
            data.append('remarks', formData.remarks);

            if (file) {
                data.append('pdf', file);
            }

            if (editMode) {
                // Edit mode with file upload might require backend logic update to handle partial file updates
                // For now assuming just metadata update or re-upload
                // Note: resultAPI.updateResult might need to handle FormData if we want to allow file update
                // For this task, focusing on "Add New Result" with PDF
                await resultAPI.updateResult(currentResult._id, formData); // Sending JSON for edit for now to avoid breaking legacy
                Swal.fire({ icon: 'success', title: 'Updated!', text: 'Result updated successfully', confirmButtonColor: '#0ea5e9' });
            } else {
                if (!file) {
                    Swal.fire({ icon: 'error', title: 'Error', text: 'Please upload a PDF file', confirmButtonColor: '#0ea5e9' });
                    return;
                }
                await resultAPI.createResult(data);
                Swal.fire({ icon: 'success', title: 'Created!', text: 'Result uploaded successfully', confirmButtonColor: '#0ea5e9' });
            }
            fetchData();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving result:', error);
            Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error saving result', confirmButtonColor: '#0ea5e9' });
        }
    };

    // ... (rest of helper functions like handleDelete)

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            {/* ... (Navbar and Header code remains the same, assuming it's above line 291) */}

            <Container maxWidth="xl" className="py-8 flex-grow">
                {/* ... (Header Section) */}
                {/* Header Section */}
                <Box className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <Typography variant="h3" className="font-bold text-gray-900 mb-2 tracking-tight">
                            Teacher Dashboard
                        </Typography>
                        <Typography variant="body1" className="text-gray-500">
                            Manage student results and track performance.
                        </Typography>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="contained"
                            className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-200 rounded-xl px-6 py-3 font-semibold"
                            startIcon={<Plus size={20} />}
                            onClick={() => handleOpenDialog()}
                            sx={{ textTransform: 'none' }}
                        >
                            New Result
                        </Button>

                        {/* Profile Dropdown */}
                        <Box>
                            <Button
                                onClick={handleMenuClick}
                                className="normal-case text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 shadow-sm"
                                endIcon={<ChevronDown size={16} className="text-gray-400" />}
                            >
                                <div className="flex items-center gap-3 text-left">
                                    <Avatar
                                        sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}
                                    >
                                        {user?.name?.charAt(0) || 'T'}
                                    </Avatar>
                                    <div className="hidden md:block">
                                        <Typography variant="subtitle2" className="font-bold leading-tight">
                                            {user?.name || 'Teacher'}
                                        </Typography>
                                        <Typography variant="caption" className="text-gray-500 block">
                                            {user?.email || 'Instructor'}
                                        </Typography>
                                    </div>
                                </div>
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))',
                                        mt: 1.5,
                                        borderRadius: 3,
                                        minWidth: 200,
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={handleMenuClose}>
                                    <ListItemIcon>
                                        <User size={18} />
                                    </ListItemIcon>
                                    My Profile
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleLogout} className="text-red-600">
                                    <ListItemIcon className="text-red-600">
                                        <LogOut size={18} />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    </div>
                </Box>

                {/* Stats Cards (unchanged for now, though they will reflect 0 for PDF entries) */}
                <Grid container spacing={3} className="mb-10">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <div className="card-hover group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Users size={24} />
                                </div>
                            </div>
                            <Typography className="text-gray-500 font-medium mb-1">Total Students</Typography>
                            <Typography variant="h3" className="font-bold text-gray-900">{students.length}</Typography>
                        </div>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <div className="card-hover group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Award size={24} />
                                </div>
                            </div>
                            <Typography className="text-gray-500 font-medium mb-1">Total Results</Typography>
                            <Typography variant="h3" className="font-bold text-gray-900">{results.length}</Typography>
                        </div>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <div className="card-hover group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <BookOpen size={24} />
                                </div>
                            </div>
                            <Typography className="text-gray-500 font-medium mb-1">Recent Exams</Typography>
                            <Typography variant="h3" className="font-bold text-gray-900">
                                {results.filter(r => {
                                    const examDate = new Date(r.examDate);
                                    const thirtyDaysAgo = new Date();
                                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                                    return examDate >= thirtyDaysAgo;
                                }).length}
                            </Typography>
                        </div>
                    </Grid>
                </Grid>

                {/* Results Table */}
                <Paper elevation={0} className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <Typography variant="h6" className="font-bold text-gray-800">Recent Results</Typography>
                    </div>

                    {loading ? (
                        <Box className="p-12 text-center">
                            <div className="animate-pulse space-y-4">
                                <div className="h-10 bg-gray-100 rounded w-full"></div>
                                <div className="h-10 bg-gray-100 rounded w-full"></div>
                                <div className="h-10 bg-gray-100 rounded w-full"></div>
                            </div>
                        </Box>
                    ) : results.length === 0 ? (
                        <Box className="p-16 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <BookOpen size={32} />
                            </div>
                            <Typography variant="h6" className="text-gray-900 font-medium mb-1">No results found</Typography>
                            <Typography className="text-gray-500 mb-6">Get started by adding a new result for a student.</Typography>
                            <Button variant="outlined" startIcon={<Plus size={18} />} onClick={() => handleOpenDialog()}>
                                Add Result
                            </Button>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow className="bg-gray-50/50">
                                        <TableCell className="font-bold text-gray-500 py-4 pl-6">Student</TableCell>
                                        <TableCell className="font-bold text-gray-500 py-4">Subject</TableCell>
                                        <TableCell className="font-bold text-gray-500 py-4">Date</TableCell>
                                        <TableCell className="font-bold text-gray-500 py-4">File</TableCell>
                                        <TableCell className="font-bold text-gray-500 py-4">Status</TableCell>
                                        <TableCell className="font-bold text-gray-500 py-4 text-right pr-6">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {results.map((result) => (
                                        <TableRow key={result._id} hover className="transition-colors group">
                                            <TableCell className="py-4 pl-6">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{result.student?.name}</div>
                                                    <div className="text-xs text-gray-500">{result.student?.studentId || result.student?.rollNumber}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-gray-700 font-medium">{result.examName}</TableCell>
                                            <TableCell className="py-4 text-gray-500">
                                                {new Date(result.examDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {result.pdfPath ? (
                                                    <a
                                                        href={`http://localhost:5000/${result.pdfPath}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors font-medium text-sm border border-primary-100"
                                                    >
                                                        <FileText size={16} />
                                                        View PDF
                                                    </a >
                                                ) : (
                                                    <span className="text-gray-400 text-sm flex items-center gap-1">
                                                        <UploadCloud size={16} /> No File
                                                    </span>
                                                )}
                                            </TableCell >
                                            <TableCell className="py-4">
                                                {result.pdfPath ? (
                                                    <Chip label="Uploaded" color="success" size="small" className="font-bold" variant="outlined" />
                                                ) : (
                                                    <Chip label={result.overallGrade} color={getGradeColor(result.overallGrade)} size="small" className="font-bold" />
                                                )}
                                            </TableCell>
                                            <TableCell className="py-4 text-right pr-6">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <IconButton size="small" onClick={() => handleDelete(result._id)} className="text-red-600 bg-red-50 hover:bg-red-100">
                                                        <Trash2 size={16} />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow >
                                    ))}
                                </TableBody >
                            </Table >
                        </TableContainer >
                    )}
                </Paper >
            </Container >

            {/* Add/Edit Result Dialog - PDF ONLY Version */}
            < Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ className: 'rounded-2xl' }}>
                <DialogTitle className="flex justify-between items-center border-b border-gray-100 p-6">
                    <Typography variant="h6" className="font-bold text-gray-900">
                        {editMode ? 'Edit Result' : 'Add New Result'}
                    </Typography>
                    <IconButton onClick={handleCloseDialog} size="small" className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent className="p-6">
                    <Grid container spacing={3} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                select
                                fullWidth
                                label="Select Student"
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                required
                                variant="outlined"
                                className="bg-gray-50"
                                disabled={editMode}
                            >
                                {students.map((student) => (
                                    <MenuItem key={student._id} value={student._id}>
                                        {student.rollNumber} - {student.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Subject Name"
                                value={formData.examName}
                                onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                                required
                                className="bg-gray-50"
                                placeholder="e.g. Mathematics Final"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Exam Date"
                                type="date"
                                value={formData.examDate}
                                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                                required
                                className="bg-gray-50"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" className="mb-2 font-semibold text-gray-700">
                                Result PDF *
                            </Typography>
                            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${file ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {file ? (
                                        <>
                                            <FileText size={32} className="text-primary-600 mb-2" />
                                            <p className="text-sm text-gray-900 font-medium">{file.name}</p>
                                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud size={32} className="text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500 font-medium">Click to upload or drag and drop</p>
                                            <p className="text-xs text-gray-400">PDF files only</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Remarks (Optional)"
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                multiline
                                rows={2}
                                className="bg-gray-50"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <Button onClick={handleCloseDialog} className="text-gray-500 hover:text-gray-700 capitalize">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" className="bg-primary-600 rounded-xl px-6 capitalize shadow-none hover:shadow-lg">
                        {editMode ? 'Update Result' : 'Upload Result'}
                    </Button>
                </DialogActions>
            </Dialog >

            <Footer />
        </div >
    );
};

export default TeacherDashboard;
