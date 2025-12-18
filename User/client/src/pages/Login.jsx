import Swal from 'sweetalert2';

// ... (previous imports remain, so I will insert Swal import at the top if I could, but I'll assume I need to ensure it's there. 
// Actually, I'll just replace the handleSubmit block and the imports section if needed.
// Wait, I can only replace contiguous blocks.
// I will separate this into two edits if I can't reach the top.
// Ah, the file view showed imports at lines 1-17.
// I will just add the import to line 18 or so, and then replace handleSubmit.
// BUT, `replace_file_content` is a single contiguous block.
// I'll check if I can just add the import near the other imports.
// The file has imports up to line 17.
// I will replace line 2 (Router imports) to include Swal? No, bad practice.
// I will replace lines 1-3 to include Swal?
// Or I can add it to the top.
// Let's do a multi-replace if I need to edit imports AND the handler?
// Tool `replace_file_content` says "Use this tool ONLY when you are making a SINGLE CONTIGUOUS block of edits".
// So I should use `multi_replace_file_content` or just do two 'replace_file_content' calls.
// I'll do two calls. First, adding the import.

// WAIT, I'll check if I can use multi_replace_file_content.
// Yes, I have `multi_replace_file_content` tool. I'll use that.

import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    TextField,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Paper,
    Box,
    Typography,
    Container,
    InputAdornment,
    IconButton
} from '@mui/material';
import { GraduationCap, UserCircle, KeyRound, Hash, Mail, Eye, EyeOff } from 'lucide-react';
import Footer from '../components/Footer';

// ... (existing imports)

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRoleChange = (event, newRole) => {
        if (newRole !== null) {
            setRole(newRole);
            setFormData({ ...formData, identifier: '', password: '' });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await login(formData, role);
            if (result.success) {
                navigate(role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
            } else {
                // Handle error (alert or snackbar)
                console.error(result.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: result.message,
                    confirmButtonColor: '#0ea5e9',
                    confirmButtonText: 'Try Again',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-xl'
                    }
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An unexpected error occurred. Please try again.',
                confirmButtonColor: '#0ea5e9'
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen relative flex flex-col bg-gray-50">
            <div className="flex-grow flex items-center justify-center p-4">
                <Container maxWidth="md">
                    {/* ... (existing login card content) */}
                    <div className="grid md:grid-cols-2 gap-0 shadow-xl rounded-2xl overflow-hidden bg-white">
                        {/* Illustration Side */}
                        <div className="hidden md:flex flex-col justify-center bg-primary-600 text-white p-12">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                                <GraduationCap size={40} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">
                                Student Result Management
                            </h2>
                            <p className="text-primary-100 opacity-90 leading-relaxed">
                                A secure and simple platform to track your academic progress.
                            </p>
                        </div>

                        {/* Login Form Side */}
                        <div className="p-10 md:p-12">
                            {/* ... (existing content) */}
                            <div className="text-center mb-10">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                                <p className="text-gray-500 text-sm">Sign in to continue</p>
                            </div>

                            {/* Role Toggle */}
                            <div className="bg-gray-50 p-1 rounded-xl mb-10">
                                <ToggleButtonGroup
                                    value={role}
                                    exclusive
                                    onChange={handleRoleChange}
                                    fullWidth
                                    className="w-full"
                                >
                                    <ToggleButton
                                        value="student"
                                        className={`border-0 rounded-lg transition-all duration-200 ${role === 'student' ? 'bg-white shadow-sm text-primary-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
                                        sx={{ textTransform: 'none', border: 'none', height: '48px' }}
                                    >
                                        Student
                                    </ToggleButton>
                                    <ToggleButton
                                        value="teacher"
                                        className={`border-0 rounded-lg transition-all duration-200 ${role === 'teacher' ? 'bg-white shadow-sm text-primary-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
                                        sx={{ textTransform: 'none', border: 'none', height: '48px' }}
                                    >
                                        Teacher
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <TextField
                                    fullWidth
                                    label={role === 'student' ? 'Roll Number' : 'Email Address'}
                                    name="identifier"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    placeholder={role === 'student' ? 'Enter your roll number' : 'Enter your email'}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {role === 'student' ? <Hash size={20} className="text-gray-400" /> : <Mail size={20} className="text-gray-400" />}
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
                                    placeholder="Enter your password"
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
                                    sx={{ mb: 1 }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-none hover:shadow-lg transition-all"
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        py: 1.5,
                                        borderRadius: '0.75rem',
                                        mt: 2
                                    }}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </form>

                            {role === 'student' ? (
                                <div className="mt-8 text-center">
                                    <Link
                                        to="/register"
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
                                    >
                                        Create Student Account
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-8 text-center">
                                    <Link
                                        to="/register-teacher"
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
                                    >
                                        Create Teacher Account
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
