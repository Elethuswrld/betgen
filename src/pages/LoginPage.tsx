
import React, { useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase';
import {
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Person, Lock, Google } from '@mui/icons-material';
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

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError("Failed to sign in with Google.");
      console.error("Error signing in with Google: ", error);
    }
  };

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
            <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="email-input">Username</InputLabel>
                <OutlinedInput
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    startAdornment={
                        <InputAdornment position="start">
                        <IconButton edge="start" sx={{
                            backgroundColor: 'white',
                            color: 'black',
                            '&:hover': {
                                backgroundColor: '#f0f0f0'
                            },
                            width: 50,
                            height: 50,
                            marginLeft: -1.7
                        }}>
                            <Person />
                        </IconButton>
                        </InputAdornment>
                    }
                    label="Username"
                />
            </FormControl>

            <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="password-input">Password</InputLabel>
                <OutlinedInput
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                        <IconButton edge="end" sx={{
                            backgroundColor: 'white',
                            color: 'black',
                            '&:hover': {
                                backgroundColor: '#f0f0f0'
                            },
                            width: 50,
                            height: 50,
                            marginRight: -1.7
                        }}>
                            <Lock />
                        </IconButton>
                        </InputAdornment>
                    }
                    label="Password"
                />
            </FormControl>

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
              onClick={handleGoogleSignIn}
              variant="outlined"
              startIcon={<Google />}
              sx={{
                borderRadius: '50px',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '12px',
                mb: 2,
                '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Sign In with Google
            </Button>
            <Button
              fullWidth
              onClick={() => setIsSignUp(!isSignUp)}
              sx={{ color: 'white' }}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don\'t have an account? Sign Up"}
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
