
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase';
import {
  Button,
  Typography,
  Box,
  TextField,
  Avatar
} from '@mui/material';
import { Person, Lock } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    background: {
      default: '#0F1923',
      paper: '#0F1923',
    },
    text: {
      primary: '#ffffff',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff',
          },
        },
        notchedOutline: {
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
        input: {
          color: '#ffffff',
          padding: '18.5px 14px',
          textAlign: 'center' 
        },
      },
    },
  },
});

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0F1923 0%, #152230 100%)',
        }}
      >
        <Box
          sx={{
            p: 4,
            maxWidth: 400,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {isSignUp ? 'CREATE ACCOUNT' : 'USER LOGIN'}
          </Typography>
          <Box component="form" onSubmit={handleEmailPasswordSubmit} sx={{ mt: 3, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'white', color: 'black', mr: 1.5}}>
                    <Person />
                </Avatar>
                <TextField
                    id="email-input"
                    type="email"
                    placeholder='Username'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                    id="password-input"
                    type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                />
                <Avatar sx={{ bgcolor: 'white', color: 'black', ml: 1.5}}>
                    <Lock />
                </Avatar>
            </Box>

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 2, 
                mb: 2, 
                borderRadius: '50px', 
                color: 'black', 
                backgroundColor: 'white',
                fontWeight: 'bold',
                padding: '12px',
                '&:hover': {
                    backgroundColor: '#f0f0f0'
                }
            }}
            >
              {isSignUp ? 'SIGN UP' : 'LOGIN'}
            </Button>

            <Button
              fullWidth
              onClick={() => setIsSignUp(!isSignUp)}
              sx={{ color: 'white' }}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
