import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Paper, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Grid, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';
const MindsetHistoryPage = () => {
    const [user] = useAuthState(auth);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchEntries = async () => {
            if (user) {
                const mindsetCollection = collection(db, `users/${user.uid}/mindset`);
                const q = query(mindsetCollection, orderBy('timestamp', 'desc'));
                const mindsetSnapshot = await getDocs(q);
                const mindsetList = mindsetSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setEntries(mindsetList);
                setLoading(false);
            }
        };
        fetchEntries();
    }, [user]);
    if (loading) {
        return _jsx(Typography, { sx: { color: 'white', textAlign: 'center', mt: 5 }, children: "Loading mindset history..." });
    }
    return (_jsx(Box, { sx: { p: { xs: 2, sm: 4, md: 6 } }, children: _jsxs(Paper, { elevation: 12, sx: {
                p: { xs: 3, sm: 5 },
                margin: 'auto',
                maxWidth: '1000px',
                background: 'rgba(44, 26, 62, 0.7)',
                backdropFilter: 'blur(12px)',
                borderRadius: '20px',
                border: '1px solid #9c27b0',
                boxShadow: '0 8px 32px 0 rgba(156, 39, 176, 0.37)',
                color: 'white',
            }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, sx: { fontWeight: 'bold', borderBottom: '2px solid #9c27b0', pb: 1, mb: 3 }, children: "Mindset Journal History" }), entries.length === 0 ? (_jsx(Typography, { children: "No journal entries found. Start by adding one from the dashboard!" })) : (entries.map(entry => (_jsxs(Accordion, { sx: { background: 'rgba(60, 30, 80, 0.8)', color: 'white', mb: 2, borderRadius: '12px', '&.Mui-expanded': { margin: '16px 0' } }, children: [_jsx(AccordionSummary, { expandIcon: _jsx(ExpandMoreIcon, { sx: { color: 'white' } }), children: _jsx(Typography, { sx: { fontWeight: 'bold' }, children: format(entry.timestamp.toDate(), 'MMMM dd, yyyy - h:mm a') }) }), _jsx(AccordionDetails, { children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "Pre-Session" }), _jsxs(Typography, { sx: { color: '#c7c7c7' }, children: ["Goals: ", entry.preSessionGoals] }), _jsx(Chip, { label: `Confidence: ${entry.confidence}/10`, sx: { mt: 1, bgcolor: '#7b1fa2' } })] }), _jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "Post-Session" }), _jsxs(Typography, { sx: { color: '#c7c7c7' }, children: ["Lessons: ", entry.lessonsLearned] }), _jsx(Chip, { label: `Discipline: ${entry.disciplineScore}/10`, sx: { mt: 1, mr: 1, bgcolor: '#7b1fa2' } }), _jsx(Chip, { label: `Emotional Bias: ${entry.emotionalBiasScore}/100`, sx: { mt: 1, bgcolor: '#7b1fa2' } })] })] }) })] }, entry.id))))] }) }));
};
export default MindsetHistoryPage;
