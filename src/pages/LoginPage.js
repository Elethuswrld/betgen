import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Button, TextField, Container, Typography, Box, AppBar, Toolbar, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#9c27b0',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
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
                setError(err.message);
            }
            else {
                setError('An unexpected error occurred.');
            }
        }
    };
    return (_jsxs(ThemeProvider, { theme: theme, children: [_jsx(AppBar, { position: "static", children: _jsx(Toolbar, { children: _jsx(Typography, { variant: "h6", component: "div", sx: { flexGrow: 1 }, children: "BetGen" }) }) }), _jsx(Container, { component: "main", maxWidth: "xs", children: _jsxs(Paper, { elevation: 6, sx: { mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [_jsx(Typography, { component: "h1", variant: "h5", children: isSignUp ? 'Sign Up' : 'Sign In' }), _jsxs(Box, { component: "form", onSubmit: handleEmailPasswordSubmit, sx: { mt: 1 }, children: [_jsx(TextField, { margin: "normal", required: true, fullWidth: true, id: "email", label: "Email Address", name: "email", autoComplete: "email", autoFocus: true, value: email, onChange: (e) => setEmail(e.target.value) }), _jsx(TextField, { margin: "normal", required: true, fullWidth: true, name: "password", label: "Password", type: "password", id: "password", autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value) }), error && (_jsx(Typography, { color: "error", variant: "body2", sx: { mt: 2 }, children: error })), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", sx: { mt: 3, mb: 2 }, children: isSignUp ? 'Sign Up' : 'Sign In' }), _jsx(Button, { fullWidth: true, onClick: handleGoogleSignIn, variant: "outlined", sx: { mb: 2 }, children: "Sign In with Google" }), _jsx(Button, { fullWidth: true, onClick: () => setIsSignUp(!isSignUp), children: isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up" })] })] }) })] }));
};
export default LoginPage;
