
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Login from './components/Login';
import { createTheme, ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Button, CircularProgress, Box } from '@mui/material';
import { deepPurple, grey } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: deepPurple,
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const App = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        {user ? (
          <>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  BetGen
                </Typography>
                <Button color="inherit" onClick={() => auth.signOut()}>Logout</Button>
                <Button color="inherit" component="a" href="/">Dashboard</Button>
                <Button color="inherit" component="a" href="/history">History</Button>
              </Toolbar>
            </AppBar>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        ) : (
          <Login />
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
