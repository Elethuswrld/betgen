import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Button, TextField, Container, Typography, Box, AppBar, Toolbar, Paper, InputAdornment } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person'; // User Icon
import LockIcon from '@mui/icons-material/Lock'; // Lock Icon
import GoogleIcon from '@mui/icons-material/Google'; // Google Icon

// --- Custom Theme Setup ---
const DARK_BLUE = '#0A1929';
// A slightly deeper, related dark color for the gradient effect
const DEEPER_DARK_BLUE = '#061017'; 
const MID_DARK = '#12283C';
const ACCENT_WHITE = '#FFFFFF';
const PRIMARY_PURPLE = '#8B008B'; 

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: PRIMARY_PURPLE,
        },
        background: {
            // Setting a default background color for fallback/base
            default: DARK_BLUE, 
            paper: 'transparent',
        },
    },
    typography: {
        h5: {
            color: ACCENT_WHITE,
            fontWeight: 600,
            letterSpacing: '3px',
            marginBottom: '40px',
        },
        button: {
            fontWeight: 'bold',
            letterSpacing: '1px',
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 50,
                    padding: '15px 0',
                },
                containedPrimary: {
                    backgroundColor: PRIMARY_PURPLE,
                    '&:hover': {
                        backgroundColor: '#9932CC', 
                    },
                },
                outlined: {
                    borderColor: MID_DARK,
                    color: ACCENT_WHITE,
                    backgroundColor: MID_DARK, 
                    '&:hover': {
                        backgroundColor: '#1C3A5A',
                        borderColor: '#1C3A5A',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        backgroundColor: MID_DARK, 
                        borderRadius: 50, 
                        paddingLeft: '10px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none', 
                    },
                    '& .MuiInputBase-input': {
                        padding: '18px 14px', 
                    },
                },
            },
        },
    },
});

const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleGoogleSignIn = async () => { /* ... (firebase logic) ... */ };
    const handleEmailPasswordSubmit = async (e) => { /* ... (firebase logic) ... */ };

    // --- Component JSX ---
    return (_jsxs(ThemeProvider, {
        theme: theme, children: [
            _jsx(AppBar, { position: "static", children: _jsx(Toolbar, { children: _jsx(Typography, { variant: "h6", component: "div", sx: { flexGrow: 1, color: ACCENT_WHITE }, children: "BetGen" }) }) }),
            
            // MAIN CONTAINER WITH GRADIENT
            _jsx(Container, {
                component: "main", maxWidth: "xs", 
                sx: {
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 0, 
                    paddingBottom: 0, 
                    // 🎨 KEY CHANGE: BACKGROUND GRADIENT
                    background: `linear-gradient(135deg, ${DEEPER_DARK_BLUE} 0%, ${DARK_BLUE} 100%)`,
                },
                children: _jsxs(Paper, {
                    elevation: 0,
                    sx: {
                        mt: 0,
                        p: 0,
                        backgroundColor: 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        padding: '40px 20px', 
                    },
                    children: [
                        _jsx(Typography, {
                            component: "h1",
                            variant: "h5",
                            sx: {
                                color: ACCENT_WHITE,
                                fontSize: '1.8em',
                                letterSpacing: '3px',
                                marginBottom: '50px',
                            },
                            children: isSignUp ? 'SIGN UP' : 'SIGN IN'
                        }),

                        _jsxs(Box, {
                            component: "form",
                            onSubmit: handleEmailPasswordSubmit,
                            sx: { mt: 1, width: '100%' },
                            children: [
                                // --- Email Input ---
                                _jsx(TextField, {
                                    margin: "normal",
                                    required: true,
                                    fullWidth: true,
                                    id: "email",
                                    placeholder: "Email Address",
                                    name: "email",
                                    autoComplete: "email",
                                    autoFocus: true,
                                    value: email,
                                    onChange: (e) => setEmail(e.target.value),
                                    InputProps: {
                                        startAdornment: _jsx(InputAdornment, { position: "start", sx: { color: ACCENT_WHITE, mr: '10px' }, children: _jsx(PersonIcon, { fontSize: "large" }) }),
                                    },
                                    sx: {
                                        '& .MuiInputBase-input': {
                                            color: ACCENT_WHITE,
                                            '&::placeholder': {
                                                opacity: 0.5,
                                                color: ACCENT_WHITE,
                                            },
                                        },
                                    }
                                }),

                                // --- Password Input ---
                                _jsx(TextField, {
                                    margin: "normal",
                                    required: true,
                                    fullWidth: true,
                                    name: "password",
                                    placeholder: "Password",
                                    type: "password",
                                    id: "password",
                                    autoComplete: "current-password",
                                    value: password,
                                    onChange: (e) => setPassword(e.target.value),
                                    InputProps: {
                                        endAdornment: _jsx(InputAdornment, { position: "end", sx: { color: ACCENT_WHITE, ml: '10px' }, children: _jsx(LockIcon, { fontSize: "large" }) }),
                                    },
                                    sx: {
                                        '& .MuiInputBase-input': {
                                            color: ACCENT_WHITE,
                                            '&::placeholder': {
                                                opacity: 0.5,
                                                color: ACCENT_WHITE,
                                            },
                                        },
                                        '& .MuiInputBase-root': {
                                            paddingLeft: '24px', 
                                        },
                                    }
                                }),

                                // --- Error Message ---
                                error && (_jsx(Typography, { color: "error", variant: "body2", sx: { mt: 2, textAlign: 'center' }, children: error })),

                                // --- Primary Sign In / Sign Up Button ---
                                _jsx(Button, {
                                    type: "submit",
                                    fullWidth: true,
                                    variant: "contained",
                                    sx: { mt: 4, mb: 2 },
                                    children: isSignUp ? 'SIGN UP' : 'SIGN IN'
                                }),

                                // --- Google Sign In Button ---
                                _jsx(Button, {
                                    fullWidth: true,
                                    onClick: handleGoogleSignIn,
                                    variant: "outlined",
                                    sx: { mb: 4, textTransform: 'uppercase', fontSize: '1.1em' },
                                    startIcon: _jsx(GoogleIcon, {}),
                                    children: "Sign In with Google"
                                }),

                                // --- Toggle Sign Up/Sign In Link ---
                                _jsxs(Typography, {
                                    variant: "body2",
                                    sx: { mt: 1, color: ACCENT_WHITE, textAlign: 'center' },
                                    children: [
                                        isSignUp ? 'Already have an account? ' : "Don't have an account? ",
                                        _jsx(Button, {
                                            onClick: () => setIsSignUp(!isSignUp),
                                            sx: {
                                                color: PRIMARY_PURPLE,
                                                fontWeight: 'bold',
                                                padding: 0,
                                                minWidth: 'unset',
                                                textTransform: 'uppercase',
                                                ml: 0.5,
                                            },
                                            children: isSignUp ? 'Sign In' : 'Sign Up'
                                        })
                                    ]
                                })
                            ]
                        })]
                })
            })]
    }));
};

export default LoginPage;