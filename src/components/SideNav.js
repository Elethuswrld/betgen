import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Typography, Avatar } from '@mui/material';
import { Dashboard, Person, Book, Logout } from '@mui/icons-material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
const SideNav = () => {
    const [user] = useAuthState(auth);
    const location = useLocation();
    const menuItems = [
        { text: 'Dashboard', icon: _jsx(Dashboard, {}), path: '/' },
        { text: 'Mindset History', icon: _jsx(Book, {}), path: '/mindset-history' },
        { text: 'Profile', icon: _jsx(Person, {}), path: '/profile' },
    ];
    const handleLogout = () => {
        auth.signOut();
    };
    return (_jsxs(Box, { sx: {
            width: 280,
            height: '100vh',
            position: 'fixed',
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column',
            bgcolor: '#1e102f',
            borderRight: '1px solid #9c27b0',
            boxShadow: '4px 0px 20px rgba(156, 39, 176, 0.2)',
        }, children: [_jsx(Box, { sx: { p: 3, textAlign: 'center' }, children: _jsx(Typography, { variant: "h4", sx: { color: 'white', fontWeight: 'bold' }, children: "BetGen" }) }), _jsx(Divider, { sx: { bgcolor: '#9c27b0' } }), _jsxs(Box, { sx: { p: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }, children: [_jsx(Avatar, { sx: { width: 60, height: 60, mb: 1, bgcolor: '#9c27b0' }, children: _jsx(Person, {}) }), _jsx(Typography, { sx: { color: 'white' }, children: user?.displayName || 'Welcome' }), _jsx(Typography, { sx: { color: '#c7c7c7', fontSize: '0.8rem' }, children: user?.email })] }), _jsx(List, { sx: { flexGrow: 1 }, children: menuItems.map((item) => (_jsxs(ListItem, { button: true, component: Link, to: item.path, sx: {
                        color: location.pathname === item.path ? '#9c27b0' : 'white',
                        margin: '8px 16px',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: 'rgba(156, 39, 176, 0.2)',
                        },
                        borderLeft: location.pathname === item.path ? '4px solid #9c27b0' : 'none',
                    }, children: [_jsx(ListItemIcon, { sx: { color: 'inherit' }, children: item.icon }), _jsx(ListItemText, { primary: item.text })] }, item.text))) }), _jsx(Divider, { sx: { bgcolor: '#9c27b0' } }), _jsx(List, { children: _jsxs(ListItem, { button: true, onClick: handleLogout, sx: { color: 'white', margin: '8px 16px', borderRadius: '8px', '&:hover': { backgroundColor: 'rgba(255, 82, 82, 0.2)' } }, children: [_jsx(ListItemIcon, { children: _jsx(Logout, { sx: { color: 'white' } }) }), _jsx(ListItemText, { primary: "Logout" })] }) })] }));
};
export default SideNav;
