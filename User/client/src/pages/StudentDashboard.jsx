import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resultAPI } from '../services/api';
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    AppBar,
    Toolbar,
    Box,
    Grid,
    Chip,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider
} from '@mui/material';
import { LogOut, Award, TrendingUp, Calendar, Zap, BookOpen, FileText, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { io } from 'socket.io-client';
import Footer from '../components/Footer';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    // Menu State
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        fetchResults();

        const socket = io('http://localhost:5000');

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('resultUpdate', () => {
            fetchResults();
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const fetchResults = async () => {
        try {
            if (!user) return;
            const userId = user._id || user.id;
            const response = await resultAPI.getStudentResults(userId);
            setResults(response.data.results);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
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

    const getGradeColor = (grade) => {
        const colors = {
            'A+': 'success', 'A': 'success',
            'B+': 'info', 'B': 'info',
            'C+': 'warning', 'C': 'warning',
            'D': 'error', 'F': 'error'
        };
        return colors[grade] || 'default';
    };

    const calculateAveragePercentage = () => {
        if (results.length === 0) return 0;
        const total = results.reduce((sum, result) => sum + parseFloat(result.percentage), 0);
        return (total / results.length).toFixed(2);
    };

    // Calculate generic stats
    const passedExams = results.filter(r => r.overallGrade !== 'F').length;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            {/* Minimal Navbar */}
            <AppBar
                position="sticky"
                elevation={0}
                className="border-b border-primary-700"
                sx={{ backgroundColor: '#0284c7', color: 'white' }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters className="justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-xl text-white">
                                <Award size={24} strokeWidth={2.5} />
                            </div>
                            <Typography variant="h6" className="font-bold text-white tracking-tight">
                                Student<span className="text-primary-100">Portal</span>
                            </Typography>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                onClick={handleMenuClick}
                                className="normal-case text-white hover:bg-white/10 rounded-xl px-3 py-2"
                                endIcon={<ChevronDown size={16} className="text-primary-100" />}
                            >
                                <div className="flex items-center gap-3 text-left">
                                    <Avatar
                                        sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: '0.875rem' }}
                                    >
                                        {user?.name?.charAt(0) || 'S'}
                                    </Avatar>
                                    <div className="hidden md:block">
                                        <Typography variant="subtitle2" className="font-bold leading-tight text-white">
                                            {user?.name || 'Student'}
                                        </Typography>
                                        <Typography variant="caption" className="text-primary-100 block opacity-80">
                                            {user?.studentId || user?.rollNumber || 'ID: N/A'}
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
                        </div>

                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="lg" className="py-8 flex-grow">
                {/* Header Section */}
                <Box className="mb-10">
                    <Typography variant="h3" className="font-bold text-gray-900 mb-2 tracking-tight">
                        Hello, {user?.name?.split(' ')[0].charAt(0).toUpperCase() + user?.name?.split(' ')[0].slice(1).toLowerCase()}!
                    </Typography>
                    <Typography variant="body1" className="text-gray-500 max-w-2xl">
                        Here is an overview of your academic performance. Class {user?.class}-{user?.section}.
                    </Typography>
                </Box>

                {/* Stats Cards Grid - Minimal & Clean */}
                <Grid container spacing={3} className="mb-10">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <div className="card-hover group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <BookOpen size={24} />
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-500 rounded-lg">All Time</span>
                            </div>
                            <Typography className="text-gray-500 font-medium mb-1">Total Exams Taken</Typography>
                            <Typography variant="h3" className="font-bold text-gray-900">{results.length}</Typography>
                        </div>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <div className="card-hover group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <TrendingUp size={24} />
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">Performance</span>
                            </div>
                            <Typography className="text-gray-500 font-medium mb-1">Average Score</Typography>
                            <div className="flex items-baseline gap-2">
                                <Typography variant="h3" className="font-bold text-gray-900">{calculateAveragePercentage()}%</Typography>
                                <Typography variant="body2" className="text-emerald-600 font-medium flex items-center">
                                    <Zap size={14} className="mr-1" fill="currentColor" /> Active
                                </Typography>
                            </div>
                        </div>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <div className="card-hover group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Award size={24} />
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 bg-violet-50 text-violet-600 rounded-lg">Latest</span>
                            </div>
                            <Typography className="text-gray-500 font-medium mb-1">Recent Grade</Typography>
                            <Typography variant="h3" className="font-bold text-gray-900">{results[0]?.overallGrade || '-'}</Typography>
                        </div>
                    </Grid>
                </Grid>

                {/* Results Section */}
                <div className="mb-6 flex items-center justify-between">
                    <Typography variant="h5" className="font-bold text-gray-900">Academic History</Typography>
                </div>

                <Paper elevation={0} className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                    {loading ? (
                        <Box className="p-12 text-center">
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            </div>
                        </Box>
                    ) : results.length === 0 ? (
                        <Box className="p-16 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Calendar size={32} />
                            </div>
                            <Typography variant="h6" className="text-gray-900 font-medium mb-1">No Results Yet</Typography>
                            <Typography className="text-gray-500">Marks will appear here once your exams are graded.</Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow className="bg-gray-50/50">
                                        <TableCell className="font-bold text-gray-500 py-5 pl-8">Subject</TableCell>
                                        <TableCell className="font-bold text-gray-500 py-5">Date</TableCell>
                                        <TableCell className="font-bold text-gray-500 py-5 text-center">Score / File</TableCell>
                                        <TableCell className="font-bold text-gray-500 py-5 text-center">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {results.map((result) => (
                                        <TableRow key={result._id} hover className="transition-colors">
                                            <TableCell className="py-5 pl-8 font-semibold text-gray-900 border-gray-100">
                                                {result.examName}
                                            </TableCell>
                                            <TableCell className="py-5 text-gray-500 border-gray-100">
                                                {new Date(result.examDate).toLocaleDateString(undefined, {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell className="py-5 text-center font-medium text-gray-700 border-gray-100">
                                                {result.pdfPath ? (
                                                    <a
                                                        href={`http://localhost:5000/${result.pdfPath}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors font-medium text-sm border border-primary-100"
                                                    >
                                                        <FileText size={16} />
                                                        View Result
                                                    </a>
                                                ) : (
                                                    <span className="font-semibold text-gray-700">{result.marksObtained} <span className="text-gray-400 text-sm font-normal">/ {result.totalMarks}</span></span>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-5 text-center border-gray-100">
                                                {result.pdfPath ? (
                                                    <Chip label="Uploaded" color="success" size="small" className="font-bold" variant="outlined" />
                                                ) : (
                                                    <Chip
                                                        label={result.overallGrade}
                                                        color={getGradeColor(result.overallGrade)}
                                                        size="small"
                                                        className="font-bold min-w-[40px]"
                                                    />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Container>
            <Footer />
        </div>
    );
};

export default StudentDashboard;
