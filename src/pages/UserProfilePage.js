import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Paper, Typography, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Avatar } from '@mui/material';
import { Person } from '@mui/icons-material';
const UserProfilePage = ({ profile, onUpdateProfile }) => {
    const [user] = useAuthState(auth);
    const [editableProfile, setEditableProfile] = useState(profile);
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
        return _jsx(Typography, { sx: { color: 'white', textAlign: 'center', mt: 5 }, children: "Loading profile..." });
    }
    return (_jsx(Box, { sx: { p: { xs: 2, sm: 4, md: 6 } }, children: _jsx(Paper, { elevation: 12, sx: {
                p: { xs: 3, sm: 5 },
                margin: 'auto',
                maxWidth: '800px',
                background: 'rgba(44, 26, 62, 0.7)', // Increased transparency
                backdropFilter: 'blur(12px)',
                borderRadius: '20px',
                border: '1px solid #9c27b0',
                boxShadow: '0 8px 32px 0 rgba(156, 39, 176, 0.37)',
                color: 'white',
            }, children: _jsxs(Grid, { container: true, spacing: 4, alignItems: "center", children: [_jsxs(Grid, { item: true, xs: 12, sm: 3, sx: { textAlign: 'center' }, children: [_jsx(Avatar, { sx: { width: 80, height: 80, bgcolor: '#9c27b0', margin: 'auto', border: '2px solid white' }, children: _jsx(Person, { sx: { fontSize: 50 } }) }), _jsx(Typography, { variant: "h5", sx: { mt: 2, fontWeight: 'bold' }, children: user?.displayName || 'Player' }), _jsx(Typography, { variant: "body2", sx: { color: '#c7c7c7' }, children: user?.email })] }), _jsxs(Grid, { item: true, xs: 12, sm: 9, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, sx: { fontWeight: 'bold', borderBottom: '2px solid #9c27b0', pb: 1, mb: 3 }, children: "Your Profile" }), _jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", sx: { display: 'flex', flexDirection: 'column', gap: 3 }, children: [_jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(TextField, { fullWidth: true, label: "Starting Balance", type: "number", value: editableProfile.startingBalance, onChange: (e) => setEditableProfile({ ...editableProfile, startingBalance: Number(e.target.value) }), InputLabelProps: { style: { color: '#c7c7c7' } }, sx: { input: { color: 'white' }, fieldset: { borderColor: '#9c27b0' } } }) }), _jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(TextField, { fullWidth: true, disabled: true, label: "Current Balance", type: "number", value: editableProfile.currentBalance.toFixed(2), InputLabelProps: { style: { color: '#c7c7c7' } }, sx: { input: { color: '#4caf50' }, fieldset: { borderColor: '#9c27b0' } } }) }), _jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(TextField, { fullWidth: true, disabled: true, label: "Total P/L", type: "number", value: editableProfile.totalProfitLoss.toFixed(2), InputLabelProps: { style: { color: '#c7c7c7' } }, sx: { input: { color: editableProfile.totalProfitLoss >= 0 ? '#4caf50' : '#f44336' }, fieldset: { borderColor: '#9c27b0' } } }) })] }), _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { id: "risk-profile-label", style: { color: '#c7c7c7' }, children: "Risk Profile" }), _jsxs(Select, { labelId: "risk-profile-label", value: editableProfile.riskProfile, label: "Risk Profile", onChange: (e) => setEditableProfile({ ...editableProfile, riskProfile: e.target.value }), sx: { color: 'white', fieldset: { borderColor: '#9c27b0' }, svg: { color: 'white' } }, children: [_jsx(MenuItem, { value: "conservative", children: "Conservative" }), _jsx(MenuItem, { value: "moderate", children: "Moderate" }), _jsx(MenuItem, { value: "aggressive", children: "Aggressive" })] })] }), _jsx(TextField, { label: "Your Financial Goals", multiline: true, rows: 4, value: editableProfile.goals, onChange: (e) => setEditableProfile({ ...editableProfile, goals: e.target.value }), InputLabelProps: { style: { color: '#c7c7c7' } }, sx: { textarea: { color: 'white' }, fieldset: { borderColor: '#9c27b0' } } }), _jsx(Box, { sx: { textAlign: 'right', mt: 2 }, children: _jsx(Button, { variant: "contained", disabled: isSaving, onClick: handleSave, sx: { bgcolor: '#9c27b0', ':hover': { bgcolor: '#7b1fa2' }, fontWeight: 'bold', py: 1.5, px: 4, boxShadow: '0 0 15px #9c27b0' }, children: isSaving ? 'Saving...' : 'Save Changes' }) })] })] })] }) }) }));
};
export default UserProfilePage;
