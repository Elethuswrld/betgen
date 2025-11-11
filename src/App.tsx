
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import useFirestore from './hooks/useFirestore';
import LoginPage from './pages/LoginPage';
import AiCoach from './components/AiCoach';
import AiChat from './components/AiChat';
import AiStrategyPanel from './components/AiStrategyPanel';
import BankrollTracker from './components/BankrollTracker';
import PerformanceDashboard from './components/PerformanceDashboard';
import MindsetZone from './components/MindsetZone';
import MindsetHistoryPage from './pages/MindsetHistoryPage';
import UserProfilePage from './pages/UserProfilePage';
import SideNav from './components/SideNav';
import ParticleBackground from './components/ParticleBackground';
import CrashGameLogger from './components/CrashGameLogger';
import CrashGameHistory from './components/CrashGameHistory';
import { Box, CircularProgress, Typography } from '@mui/material';
import './index.css';

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    crashGames = [],
    userProfile,
    mindsetEntries,
    loading: firestoreLoading,
    handleAddCrashGame,
    handleDeleteCrashGame,
    handleUpdateCrashGame,
    handleSaveMindsetEntry,
    handleUpdateProfile,
  } = useFirestore(user);

  if (authLoading || (user && firestoreLoading)) {
    return (
      <Box
        sx={{
          backgroundColor: 'brand.dark',
          color: 'brand.light',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <CircularProgress color="primary" />
        <Typography sx={{ mt: 2 }}>Loading BetGen...</Typography>
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <ParticleBackground />
      <div className="text-brand-light min-h-screen font-sans">
        <Box sx={{ display: 'flex' }}>
          {user && <SideNav />}
          <Box component="main" sx={{ flexGrow: 1, ml: user ? { lg: '280px' } : 0, zIndex: 1 }}>
            <Routes>
              <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
              <Route
                path="/"
                element={
                  user ? (
                    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                      <h1 className="text-4xl font-orbitron text-center mb-8 animate-glow">BetGen Dashboard</h1>
                      <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-2">
                          <CrashGameLogger onAddCrashGame={handleAddCrashGame} />
                          <PerformanceDashboard rounds={crashGames} />
                          <CrashGameHistory
                            crashGames={crashGames}
                            onDeleteGame={handleDeleteCrashGame}
                            onUpdateGame={handleUpdateCrashGame}
                          />
                        </div>
                        <div className="lg:col-span-2">
                          <AiStrategyPanel />
                          <BankrollTracker profile={userProfile} />
                          <AiChat />
                          <MindsetZone onSave={handleSaveMindsetEntry} />
                          <AiCoach crashGames={crashGames} mindsetEntries={mindsetEntries} />
                        </div>
                      </main>
                    </div>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/mindset-history"
                element={user ? <MindsetHistoryPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/profile"
                element={
                  user ? (
                    <UserProfilePage profile={userProfile} onUpdateProfile={handleUpdateProfile} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          </Box>
        </Box>
      </div>
    </BrowserRouter>
  );
};

export default App;
