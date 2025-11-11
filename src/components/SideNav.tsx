
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Typography, Avatar } from '@mui/material';
import { Dashboard, BarChart, Person, Book, Logout } from '@mui/icons-material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const SideNav: React.FC = () => {
    const [user] = useAuthState(auth);
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/' },
        { text: 'Mindset History', icon: <Book />, path: '/mindset-history' },
        { text: 'Profile', icon: <Person />, path: '/profile' },
    ];

    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <Box sx={{
            width: 280,
            height: '100vh',
            position: 'fixed',
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column',
            bgcolor: '#1e102f',
            borderRight: '1px solid #9c27b0',
            boxShadow: '4px 0px 20px rgba(156, 39, 176, 0.2)',
        }}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>BetGen</Typography>
            </Box>
            <Divider sx={{ bgcolor: '#9c27b0' }} />
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <Avatar sx={{ width: 60, height: 60, mb: 1, bgcolor: '#9c27b0' }}>
                    <Person/>
                </Avatar>
                <Typography sx={{ color: 'white' }}>{user?.displayName || 'Welcome'}</Typography>
                <Typography sx={{ color: '#c7c7c7', fontSize: '0.8rem' }}>{user?.email}</Typography>
            </Box>
            <List sx={{ flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <ListItem component={Link} to={item.path} key={item.text} sx={{
                        color: location.pathname === item.path ? '#9c27b0' : 'white',
                        margin: '8px 16px',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: 'rgba(156, 39, 176, 0.2)',
                        },
                        borderLeft: location.pathname === item.path ? '4px solid #9c27b0' : 'none',
                    }}>
                        <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ bgcolor: '#9c27b0' }} />
            <List>
                <ListItem onClick={handleLogout} sx={{ color: 'white', margin: '8px 16px', borderRadius: '8px', '&:hover': { backgroundColor: 'rgba(255, 82, 82, 0.2)' } }}>
                    <ListItemIcon><Logout sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Box>
    );
};

export default SideNav;
