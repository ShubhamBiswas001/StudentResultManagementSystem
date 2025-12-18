import { Typography, Container, Box } from '@mui/material';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <Box component="footer" className="py-6 mt-auto border-t border-gray-100 bg-white/50 backdrop-blur-sm">
            <Container maxWidth="lg" className="flex flex-col md:flex-row justify-between items-center gap-4">
                <Typography variant="body2" className="text-gray-500 font-medium text-center md:text-left">
                    &copy; {new Date().getFullYear()} Student Result Management System. All rights reserved.
                </Typography>

                <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <span>Made with</span>
                    <Heart size={14} className="text-red-400 fill-red-400" />
                    <span>for better education</span>
                </div>
            </Container>
        </Box>
    );
};

export default Footer;
