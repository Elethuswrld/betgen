import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, } from 'firebase/auth';
import { Button, Container, Typography, Box, TextField, Grid, Link, } from '@mui/material';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isSigningUp) {
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
                setError("An unexpected error occurred.");
            }
        }
    };
    return (_jsx(Container, { maxWidth: "xs", children: _jsxs(Box, { sx: {
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }, children: [_jsx(Typography, { component: "h1", variant: "h5", children: isSigningUp ? 'Sign Up' : 'Sign In' }), _jsxs(Box, { component: "form", onSubmit: handleSubmit, sx: { mt: 1 }, children: [_jsx(TextField, { margin: "normal", required: true, fullWidth: true, id: "email", label: "Email Address", name: "email", autoComplete: "email", autoFocus: true, value: email, onChange: (e) => setEmail(e.target.value) }), _jsx(TextField, { margin: "normal", required: true, fullWidth: true, name: "password", label: "Password", type: "password", id: "password", autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value) }), error && (_jsx(Typography, { color: "error", variant: "body2", sx: { mt: 1 }, children: error })), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", sx: { mt: 3, mb: 2 }, children: isSigningUp ? 'Sign Up' : 'Sign In' }), _jsx(Grid, { container: true, justifyContent: "flex-end", children: _jsx(Grid, { item: true, children: _jsx(Link, { href: "#", variant: "body2", onClick: () => setIsSigningUp(!isSigningUp), children: isSigningUp
                                        ? 'Already have an account? Sign In'
                                        : "Don't have an account? Sign Up" }) }) })] })] }) }));
};
export default Login;
