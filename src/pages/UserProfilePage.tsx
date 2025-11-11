
import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Paper, Typography, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Avatar } from '@mui/material';
import { Person } from '@mui/icons-material';

interface UserProfile {
    startingBalance: number;
    currentBalance: number;
    totalProfitLoss: number;
    riskProfile: string;
    goals: string;
}

interface UserProfilePageProps {
    profile: UserProfile | null;
    onUpdateProfile: (newProfile: UserProfile) => Promise<void>;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ profile, onUpdateProfile }) => {
    const [user] = useAuthState(auth);
    const [editableProfile, setEditableProfile] = useState<UserProfile | null>(profile);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setEditableProfile(profile);
    }, [profile]);

    const handleSave = async () => {
        if (user && editableProfile) {
            setIsSaving(true);
            await onUpdateProfile(editableProfile);
            setIsSaving(false);
            // Add a snackbar or toast for feedback here
        }
    };

    if (!editableProfile) {
        return <Typography sx={{ color: 'white', textAlign: 'center', mt: 5 }}>Loading profile...</Typography>;
    }

  return (
    <Box sx={{ p: { xs: 2, sm: 4, md: 6 } }}>
      <Paper elevation={12} sx={{
          p: { xs: 3, sm: 5 },
          margin: 'auto',
          maxWidth: '800px',
          background: 'rgba(44, 26, 62, 0.7)', // Increased transparency
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          border: '1px solid #9c27b0',
          boxShadow: '0 8px 32px 0 rgba(156, 39, 176, 0.37)',
          color: 'white',
      }}>
        <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} sm={3} sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#9c27b0', margin: 'auto', border: '2px solid white' }}>
                    <Person sx={{ fontSize: 50 }} />
                </Avatar>
                <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>{user?.displayName || 'Player'}</Typography>
                <Typography variant="body2" sx={{ color: '#c7c7c7' }}>{user?.email}</Typography>
            </Grid>

            <Grid item xs={12} sm={9}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', borderBottom: '2px solid #9c27b0', pb: 1, mb: 3 }}>Your Profile</Typography>
                <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Starting Balance" type="number" value={editableProfile.startingBalance} onChange={(e) => setEditableProfile({ ...editableProfile, startingBalance: Number(e.target.value) })} InputLabelProps={{ style: { color: '#c7c7c7' } }} sx={{ input: { color: 'white' }, fieldset: { borderColor: '#9c27b0' } }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth disabled label="Current Balance" type="number" value={editableProfile.currentBalance.toFixed(2)} InputLabelProps={{ style: { color: '#c7c7c7' } }} sx={{ input: { color: '#4caf50' }, fieldset: { borderColor: '#9c27b0' } }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth disabled label="Total P/L" type="number" value={editableProfile.totalProfitLoss.toFixed(2)} InputLabelProps={{ style: { color: '#c7c7c7' } }} sx={{ input: { color: editableProfile.totalProfitLoss >= 0 ? '#4caf50' : '#f44336' }, fieldset: { borderColor: '#9c27b0' } }} />
                        </Grid>
                    </Grid>
                    <FormControl fullWidth>
                        <InputLabel id="risk-profile-label" style={{ color: '#c7c7c7' }}>Risk Profile</InputLabel>
                        <Select
                            labelId="risk-profile-label"
                            value={editableProfile.riskProfile}
                            label="Risk Profile"
                            onChange={(e) => setEditableProfile({ ...editableProfile, riskProfile: e.target.value })}
                            sx={{ color: 'white', fieldset: { borderColor: '#9c27b0' }, svg: { color: 'white' } }}
                        >
                            <MenuItem value="conservative">Conservative</MenuItem>
                            <MenuItem value="moderate">Moderate</MenuItem>
                            <MenuItem value="aggressive">Aggressive</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Your Financial Goals"
                        multiline
                        rows={4}
                        value={editableProfile.goals}
                        onChange={(e) => setEditableProfile({ ...editableProfile, goals: e.target.value })}
                        InputLabelProps={{ style: { color: '#c7c7c7' } }}
                        sx={{ textarea: { color: 'white' }, fieldset: { borderColor: '#9c27b0' } }}
                    />
                    <Box sx={{ textAlign: 'right', mt: 2 }}>
                        <Button variant="contained" disabled={isSaving} onClick={handleSave} sx={{ bgcolor: '#9c27b0', ':hover': { bgcolor: '#7b1fa2' }, fontWeight: 'bold', py: 1.5, px: 4, boxShadow: '0 0 15px #9c27b0' }}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserProfilePage;
