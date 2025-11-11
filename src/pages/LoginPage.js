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
const MID_DARK = '#12283C';
const ACCENT_WHITE = '#FFFFFF';
const PRIMARY_PURPLE = '#8B008B'; // Used for the main login button

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: PRIMARY_PURPLE,
        },
        background: {
            default: DARK_BLUE, // Background of the entire page
            paper: 'transparent', // Make the Paper component transparent
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
                    borderRadius: 50, // Highly rounded buttons
                    padding: '15px 0',
                },
                containedPrimary: {
                    backgroundColor: PRIMARY_PURPLE,
                    '&:hover': {
                        backgroundColor: '#9932CC', // Slightly lighter on hover
                    },
                },
                outlined: {
                    borderColor: MID_DARK,
                    color: ACCENT_WHITE,
                    backgroundColor: MID_DARK, // Dark background for outlined button
                    '&:hover': {
                        backgroundColor: '#1C3A5A',
                        borderColor: '#1C3A5A',
                    },
                },
            },
        },
        // Custom styling for TextField to mimic the rounded/dark look
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        backgroundColor: MID_DARK, // Dark background inside the input field
                        borderRadius: 50, // Highly rounded input field
                        paddingLeft: '10px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none', // Remove the outline border
                    },
                    '& .MuiInputBase-input': {
                        padding: '18px 14px', // Increase padding for height
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

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        }
        catch (error) {
            setError("Failed to sign in with Google.");
            console.error("Error signing in with Google: ", error);
        }
    };

    const handleEmailPasswordSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        }
        catch (err) {
            if (err instanceof Error) {
                // Firebase error codes are usually in the message, e.g., "Firebase: Error (auth/invalid-email)."
                setError(err.message.replace('Firebase: Error ', '').replace(/\(auth\/.*?\)/, '').trim());
            }
            else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (_jsxs(ThemeProvider, {
        theme: theme, children: [
            // AppBar (Toolbar) is left for context but styled to be transparent
            _jsx(AppBar, { position: "static", children: _jsx(Toolbar, { children: _jsx(Typography, { variant: "h6", component: "div", sx: { flexGrow: 1, color: ACCENT_WHITE }, children: "BetGen" }) }) }),
            
            // Main Content Container
            _jsx(Container, {
                component: "main", maxWidth: "xs", sx: {
                    // Ensures the background is applied to the whole page container
                    backgroundColor: DARK_BLUE, 
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 0, // Reset default padding
                    paddingBottom: 0, // Reset default padding
                },
                children: _jsxs(Paper, {
                    // Removed elevation and explicit background for the paper to blend with the body
                    elevation: 0,
                    sx: {
                        mt: 0, // Centered vertically now
                        p: 0,
                        backgroundColor: 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        padding: '40px 20px', // Add some internal padding
                    },
                    children: [
                        // Heading: SIGN IN / SIGN UP
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
                                    // Removed label to use placeholder effect
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
                                    // Removed label to use placeholder effect
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
                                        // The lock icon is on the right, so we don't need the start adornment here
                                        '& .MuiInputBase-root': {
                                            paddingLeft: '24px', // Match the left padding of the email field
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
                                    sx: { mt: 4, mb: 2 }, // Increased top margin
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