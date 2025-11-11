import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Paper, Typography, Box, Button, CircularProgress, Tooltip } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
const AiStrategyPanel = () => {
    const [user] = useAuthState(auth);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (user) {
            const unsubscribe = onSnapshot(doc(db, 'users', user.uid, 'analytics', 'latest'), (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    // --- Mock calculations for new fields ---
                    data.riskRating = Math.round(Math.random() * 100); // Placeholder
                    data.suggestedAction = data.totalProfitLoss > 0 ? "Keep up the great work!" : "Consider lowering your bet size."; // Placeholder
                    setAnalytics(data);
                }
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user]);
    // Function to handle the button click - for now, it will just log to the console
    const handleAskAi = () => {
        console.log("Opening AI Chat...");
        // In a real implementation, this would trigger a modal or navigate to the chat view
    };
    const getRiskColor = (rating) => {
        if (rating < 40)
            return '#00ff00'; // Green for low risk
        if (rating < 70)
            return '#ffff00'; // Yellow for medium risk
        return '#f44336'; // Red for high risk
    };
    if (loading) {
        return _jsx(CircularProgress, { color: "secondary" });
    }
    if (!analytics) {
        return _jsx(Typography, { children: "No analytics data available yet." });
    }
    const riskColor = getRiskColor(analytics.riskRating || 0);
    return (_jsxs(Paper, { sx: {
            p: 3,
            mt: 4,
            borderRadius: '16px',
            color: 'white',
            background: 'rgba(44, 26, 62, 0.6)', // Semi-transparent background
            backdropFilter: 'blur(10px)',
            border: `1px solid ${riskColor}`,
            boxShadow: `0 0 20px ${riskColor}`,
            animation: 'fadeIn 0.7s ease-in-out',
            '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
            },
        }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, sx: { fontWeight: 'bold' }, children: "AI Strategy Panel" }), _jsxs(Box, { sx: { my: 3 }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "Today's Summary" }), _jsxs(Typography, { children: ["Rounds: ", analytics.totalRounds, " | Win Rate: ", analytics.winRate.toFixed(1), "% | P/L: $", analytics.totalProfitLoss.toFixed(2)] })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 3 }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "Risk Rating" }), _jsx(Tooltip, { title: "Your current bankroll volatility risk", children: _jsx(Box, { sx: { color: riskColor, fontWeight: 'bold', fontSize: '1.5rem' }, children: analytics.riskRating?.toFixed(0) }) })] }), _jsxs(Box, { sx: { my: 3 }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "Suggested Action" }), _jsxs(Typography, { children: ["\uD83E\uDD16 ", analytics.suggestedAction] })] }), _jsx(Button, { variant: "contained", fullWidth: true, onClick: handleAskAi, sx: {
                    mt: 2,
                    bgcolor: '#9c27b0',
                    fontWeight: 'bold',
                    py: 1.5,
                    boxShadow: '0 0 15px #9c27b0',
                    ':hover': {
                        bgcolor: '#7b1fa2',
                        boxShadow: '0 0 25px #9c27b0'
                    }
                }, children: "Ask AI for Advice" })] }));
};
export default AiStrategyPanel;
