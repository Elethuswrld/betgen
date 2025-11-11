import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, TextField, Box, Typography, Paper, Slider, Select, MenuItem, InputLabel, FormControl, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AIStrategyEngine from '../services/aiStrategyEngine';
const CrashGameLogger = ({ onAddCrashGame }) => {
    const [user] = useAuthState(auth);
    const [game, setGame] = useState('aviator');
    const [amount, setAmount] = useState(0);
    const [cashOutMultiplier, setCashOutMultiplier] = useState(1.5);
    const [crashPoint, setCrashPoint] = useState(0);
    const [notes, setNotes] = useState('');
    const [mindset, setMindset] = useState('Neutral');
    const [reasonForEntry, setReasonForEntry] = useState('');
    const [logType, setLogType] = useState('cashout');
    const triggerPostRoundAnalysis = async () => {
        if (!user)
            return;
        const engine = new AIStrategyEngine(user.uid);
        // Run analysis and get the top insight
        const analytics = await engine.runFullAnalysis();
        const topInsight = analytics.insights.length > 0 ? analytics.insights[0] : null;
        // Post a message to the chat
        if (topInsight) {
            const chatMessage = `💡 Quick insight after your last round: ${topInsight}`;
            await addDoc(collection(db, `users/${user.uid}/chat`), {
                text: chatMessage,
                sender: 'ai',
                timestamp: serverTimestamp()
            });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const gameData = {
            game,
            amount,
            cashOutMultiplier: logType === 'cashout' ? cashOutMultiplier : 0,
            crashPoint: logType === 'crash' ? crashPoint : cashOutMultiplier,
            notes,
            mindset,
            reasonForEntry,
        };
        onAddCrashGame(gameData);
        // Trigger AI analysis after logging the game
        await triggerPostRoundAnalysis();
        // Reset form
        setAmount(0);
        setCashOutMultiplier(1.5);
        setCrashPoint(0);
        setNotes('');
        setMindset('Neutral');
        setReasonForEntry('');
    };
    const handleLogTypeChange = (event, newLogType) => {
        if (newLogType !== null) {
            setLogType(newLogType);
        }
    };
    return (_jsxs(Paper, { elevation: 3, sx: {
            p: 4,
            mb: 4,
            bgcolor: '#2c1a3e',
            color: 'white',
            borderRadius: '16px',
            border: '1px solid #9c27b0'
        }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, sx: { fontWeight: 'bold', color: '#f5f5f5' }, children: "Log a Crash Game" }), _jsx("form", { onSubmit: handleSubmit, children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }, children: [_jsxs(ToggleButtonGroup, { color: "secondary", value: logType, exclusive: true, onChange: handleLogTypeChange, "aria-label": "Log Type", fullWidth: true, sx: {
                                mb: 2,
                                '& .MuiToggleButtonGroup-grouped': {
                                    color: 'white',
                                    borderColor: '#9c27b0',
                                    '&.Mui-selected': {
                                        backgroundColor: '#9c27b0',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#7b1fa2'
                                        }
                                    },
                                    '&:not(.Mui-selected):hover': {
                                        backgroundColor: 'rgba(156, 39, 176, 0.2)'
                                    }
                                }
                            }, children: [_jsx(ToggleButton, { value: "cashout", children: "Cashout" }), _jsx(ToggleButton, { value: "crash", children: "Crash" })] }), _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { id: "game-select-label", sx: { color: 'gray' }, children: "Game" }), _jsxs(Select, { labelId: "game-select-label", value: game, label: "Game", onChange: (e) => setGame(e.target.value), sx: { color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#9c27b0' }, '& .MuiSvgIcon-root': { color: 'white' } }, children: [_jsx(MenuItem, { value: "aviator", children: "Aviator" }), _jsx(MenuItem, { value: "skycash", children: "Skycash" }), _jsx(MenuItem, { value: "xride", children: "XRide" }), _jsx(MenuItem, { value: "redrocket", children: "Red Rocket" })] })] }), _jsx(TextField, { label: "Amount", type: "number", value: amount, onChange: (e) => setAmount(parseFloat(e.target.value)), required: true, sx: { input: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } } } }), logType === 'cashout' ? (_jsxs(_Fragment, { children: [_jsxs(Typography, { gutterBottom: true, children: ["Cash-out Multiplier: ", cashOutMultiplier, "x"] }), _jsx(Slider, { value: cashOutMultiplier, onChange: (_, newValue) => setCashOutMultiplier(newValue), min: 1.01, max: 100, step: 0.01, sx: { color: '#9c27b0' } })] })) : (_jsx(TextField, { label: "Crash Point", type: "number", value: crashPoint, onChange: (e) => setCrashPoint(parseFloat(e.target.value)), required: true, sx: { input: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } } } })), _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { id: "mindset-select-label", sx: { color: 'gray' }, children: "Mindset" }), _jsxs(Select, { labelId: "mindset-select-label", value: mindset, label: "Mindset", onChange: (e) => setMindset(e.target.value), sx: { color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#9c27b0' }, '& .MuiSvgIcon-root': { color: 'white' } }, children: [_jsx(MenuItem, { value: "Neutral", children: "Neutral" }), _jsx(MenuItem, { value: "Focused", children: "Focused" }), _jsx(MenuItem, { value: "Greedy", children: "Greedy" }), _jsx(MenuItem, { value: "Tilted", children: "Tilted" }), _jsx(MenuItem, { value: "Disciplined", children: "Disciplined" })] })] }), _jsx(TextField, { label: "Reason for Entry", value: reasonForEntry, onChange: (e) => setReasonForEntry(e.target.value), fullWidth: true, sx: { input: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } } } }), _jsx(TextField, { label: "Notes", value: notes, onChange: (e) => setNotes(e.target.value), fullWidth: true, sx: { input: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } } } }), _jsx(Button, { type: "submit", variant: "contained", sx: { mt: 2, bgcolor: '#9c27b0', ':hover': { bgcolor: '#7b1fa2' }, fontWeight: 'bold', py: 1.5 }, children: "Log Game" })] }) })] }));
};
export default CrashGameLogger;
