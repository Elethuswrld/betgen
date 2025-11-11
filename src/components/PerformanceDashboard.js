import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Paper, Typography, Grid, Tooltip, Box, CircularProgress } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
// --- STYLED COMPONENT FOR AI CARDS ---
/**
 * A stylized card for displaying a single AI insight with a neon glow effect.
 */
const AiInsightCard = ({ title, value, unit, tooltip, glowColor = '#00FFC6' }) => (_jsx(Tooltip, { title: tooltip, placement: "top", children: _jsxs(Paper, { sx: {
            p: 2,
            textAlign: 'center',
            color: 'white',
            borderRadius: '16px',
            height: '100%',
            background: 'rgba(27, 27, 39, 0.7)', // Glassmorphism background
            backdropFilter: 'blur(10px)',
            border: `1px solid ${glowColor}`,
            animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px) scale(1.03)',
                boxShadow: `0 0 25px 3px ${glowColor}`,
            },
        }, children: [_jsxs(Typography, { variant: "h4", className: "font-orbitron font-bold", children: [value, unit && _jsx(Typography, { component: "span", variant: "h6", sx: { ml: 0.5 }, children: unit })] }), _jsx(Typography, { variant: "body2", sx: { color: '#c7c7c7' }, children: title })] }) }));
// --- MAIN COMPONENT ---
const PerformanceDashboard = ({ rounds }) => {
    const [user] = useAuthState(auth);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    /**
     * Subscribes to the latest AI analytics data from Firestore in real-time.
     */
    useEffect(() => {
        if (user) {
            const unsubscribe = onSnapshot(doc(db, 'users', user.uid, 'analytics', 'latest'), (doc) => {
                if (doc.exists()) {
                    setAnalytics(doc.data());
                }
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user]);
    /**
     * Processes round data to calculate cumulative bankroll progression for the chart.
     */
    const bankrollData = rounds.slice().reverse().reduce((acc, round, index) => {
        const previousBankroll = acc.length > 0 ? acc[acc.length - 1].bankroll : 0;
        acc.push({
            name: `R${index + 1}`,
            profit: round.profit,
            bankroll: previousBankroll + round.profit,
        });
        return acc;
    }, []);
    return (_jsxs(Paper, { elevation: 12, sx: { p: { xs: 2, md: 3 }, mt: 4, color: 'white', border: '1px solid #4B00FF', borderRadius: '20px', background: 'rgba(10, 10, 20, 0.5)', backdropFilter: 'blur(5px)' }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, className: "font-orbitron font-bold", children: "AI Performance Dashboard" }), loading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', my: 4 }, children: _jsx(CircularProgress, { sx: { color: '#00FFC6' } }) })) : !analytics ? (_jsx(Typography, { sx: { textAlign: 'center', my: 4, color: '#c7c7c7' }, children: "Log your first round to see AI insights." })) : (_jsxs(Box, { children: [_jsxs(Grid, { container: true, spacing: 2, sx: { mt: 2, mb: 4 }, children: [_jsx(Grid, { item: true, xs: 6, sm: 6, md: 3, children: _jsx(AiInsightCard, { title: "Win Rate", value: analytics.winRate.toFixed(1), unit: "%", tooltip: "Percentage of rounds won", glowColor: "#00FFC6" }) }), _jsx(Grid, { item: true, xs: 6, sm: 6, md: 3, children: _jsx(AiInsightCard, { title: "Avg. Multiplier", value: analytics.avgMultiplier.toFixed(2), unit: "x", tooltip: "Your average winning multiplier", glowColor: "#00C4FF" }) }), _jsx(Grid, { item: true, xs: 6, sm: 6, md: 3, children: _jsx(AiInsightCard, { title: "Risk/Reward", value: analytics.riskRewardRatio.toFixed(2), unit: "", tooltip: "Ratio of average win to average loss", glowColor: "#FFD700" }) }), _jsx(Grid, { item: true, xs: 6, sm: 6, md: 3, children: _jsx(AiInsightCard, { title: "Best Range", value: analytics.bestRange, unit: "x", tooltip: "The multiplier range where you are most profitable", glowColor: "#FF6B00" }) })] }), _jsx(Tooltip, { title: analytics.performanceSummary, placement: "top", children: _jsxs(Paper, { sx: {
                                p: 2, mb: 4, textAlign: 'center', color: 'white', borderRadius: '16px', height: '100%',
                                background: 'linear-gradient(135deg, rgba(75, 0, 255, 0.3), rgba(0, 255, 198, 0.2))',
                                border: `1px solid #4B00FF`, boxShadow: `0 0 20px 0px #4B00FF`,
                            }, children: [_jsx(Typography, { variant: "body1", className: "font-orbitron font-bold mb-1", children: "\uD83D\uDCA1 AI Suggestion" }), _jsx(Typography, { variant: "body2", sx: { color: '#e0e0e0' }, children: analytics.aiSuggestion })] }) })] })), _jsx(Typography, { variant: "h6", className: "font-orbitron font-bold mt-4 mb-2", children: "Bankroll Progression" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(ComposedChart, { data: bankrollData, margin: { top: 5, right: 20, left: -10, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(75, 0, 255, 0.3)" }), _jsx(XAxis, { dataKey: "name", stroke: "#c7c7c7" }), _jsx(YAxis, { yAxisId: "left", stroke: "#00FFC6" }), _jsx(YAxis, { yAxisId: "right", orientation: "right", stroke: "#FFD700" }), _jsx(RechartsTooltip, { contentStyle: {
                                backgroundColor: 'rgba(27, 27, 39, 0.9)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid #00FFC6',
                                color: 'white'
                            }, formatter: (value, name) => name === 'Profit' ? `$${value.toFixed(2)}` : `$${value.toFixed(2)}` }), _jsx(Legend, { wrapperStyle: { color: 'white' } }), _jsx(Bar, { yAxisId: "right", dataKey: "profit", name: "Profit", children: bankrollData.map((entry, index) => (_jsx("cell", { fill: entry.profit >= 0 ? '#00C4FF' : '#FF6B00' }, `cell-${index}`))) }), _jsx(Line, { yAxisId: "left", type: "monotone", dataKey: "bankroll", name: "Bankroll", stroke: "#00FFC6", strokeWidth: 2, dot: false, activeDot: { r: 8, style: { fill: '#fff', stroke: '#00FFC6' } } })] }) })] }));
};
export default PerformanceDashboard;
