import { createTheme } from '@mui/material/styles';
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00ff99', // Electric Neon Green
        },
        secondary: {
            main: '#00ccff', // Electric Neon Blue
        },
        background: {
            default: '#0d1117', // bg-gray-950
            paper: '#161b22', // A slightly lighter dark for cards
        },
        text: {
            primary: '#c9d1d9', // text-gray-100
            secondary: '#8b949e',
        },
        success: {
            main: '#2e7d32',
        },
        error: {
            main: '#d32f2f', // Soft Red for losses
        },
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        h1: { fontFamily: '"Orbitron", "Helvetica", "Arial", sans-serif', fontWeight: 700 },
        h2: { fontFamily: '"Orbitron", "Helvetica", "Arial", sans-serif', fontWeight: 700 },
        h3: { fontFamily: '"Orbitron", "Helvetica", "Arial", sans-serif', fontWeight: 700 },
        h4: { fontFamily: '"Orbitron", "Helvetica", "Arial", sans-serif', fontWeight: 700 },
        h5: { fontFamily: '"Orbitron", "Helvetica", "Arial", sans-serif', fontWeight: 700 },
        h6: { fontFamily: '"Orbitron", "Helvetica", "Arial", sans-serif', fontWeight: 700 },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: '1px solid #30363d',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0, 255, 153, 0.2)', // Glowing effect
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    background: 'linear-gradient(45deg, #00ff99 30%, #00ccff 90%)',
                    color: '#0d1117',
                    fontWeight: 'bold',
                    boxShadow: '0 0 15px rgba(0, 255, 153, 0.5)',
                    '&:hover': {
                        boxShadow: '0 0 25px rgba(0, 255, 153, 0.8)',
                    },
                },
            },
        },
    },
});
export default theme;
