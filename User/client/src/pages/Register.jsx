import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Container,
    InputAdornment,
    IconButton
} from '@mui/material';
import { UserPlus, Hash, Calendar, KeyRound, Type, Eye, EyeOff } from 'lucide-react';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'Passwords do not match. Please try again.',
                confirmButtonColor: '#0ea5e9',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-xl'
                }
            });
            return;
        }

        setLoading(true);
        try {
            const result = await register({
                name: formData.name,
                rollNumber: formData.rollNumber,
                dateOfBirth: formData.dateOfBirth,
                password: formData.password
            });

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: 'Welcome to the Student Portal',
                    confirmButtonColor: '#0ea5e9',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-xl'
                    }
                }).then(() => {
                    navigate('/student/dashboard');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: result.message || 'Something went wrong. Please try again.',
                    confirmButtonColor: '#0ea5e9',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-xl'
                    }
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An unexpected error occurred. Please try again.',
                confirmButtonColor: '#0ea5e9',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-xl'
                }
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-grow flex items-center justify-center py-12 px-4">
                <Container maxWidth="sm">
                    {/* ... (existing form content) */}
                    <Paper elevation={0} className="p-10 rounded-2xl shadow-xl bg-white border border-gray-100">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl mb-4 text-primary-600">
                                <UserPlus size={32} />
                            </div>
                            <Typography variant="h4" className="font-bold text-gray-900 mb-2">
                                Create Account
                            </Typography>
                            <Typography variant="body2" className="text-gray-500">
                                Join the student result management system
                            </Typography>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                placeholder="Enter your full name"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Type size={20} className="text-gray-400" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                label="Roll Number"
                                name="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                placeholder="Enter your roll number"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Hash size={20} className="text-gray-400" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Calendar size={20} className="text-gray-400" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                placeholder="Min. 6 chars, A-Z, a-z, 0-9, special"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <KeyRound size={20} className="text-gray-400" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                placeholder="Confirm your password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <KeyRound size={20} className="text-gray-400" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle confirm password visibility"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{ mb: 1 }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-3.5 shadow-none hover:shadow-lg transition-all font-semibold text-lg"
                                sx={{
                                    textTransform: 'none',
                                    mt: 2
                                }}
                            >
                                {loading ? 'Creating Account...' : 'Register'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center bg-gray-50 p-4 rounded-xl">
                            <Typography variant="body2" className="text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-primary-600 hover:text-primary-700 font-bold hover:underline"
                                >
                                    Sign in here
                                </Link>
                            </Typography>
                        </div>
                    </Paper>
                </Container>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
