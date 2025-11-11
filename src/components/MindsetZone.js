import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Paper, Typography, Box, Button, TextField, Slider, Divider } from '@mui/material';
const MindsetZone = ({ onSave }) => {
    // States for pre-session
    const [preSessionGoals, setPreSessionGoals] = useState('');
    const [confidence, setConfidence] = useState(7);
    // States for post-session
    const [lessonsLearned, setLessonsLearned] = useState('');
    const [disciplineScore, setDisciplineScore] = useState(7);
    const [emotionalBiasScore, setEmotionalBiasScore] = useState(50);
    const handleSave = () => {
        onSave({ preSessionGoals, confidence, lessonsLearned, disciplineScore, emotionalBiasScore });
        // Reset fields
        setPreSessionGoals('');
        setConfidence(7);
        setLessonsLearned('');
        setDisciplineScore(7);
        setEmotionalBiasScore(50);
    };
    return (_jsxs(Paper, { elevation: 3, sx: {
            p: 4,
            mt: 4,
            bgcolor: '#2c1a3e',
            color: 'white',
            borderRadius: '16px',
            border: '1px solid #9c27b0'
        }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, sx: { fontWeight: 'bold' }, children: "\uD83E\uDDD8 Mindset Zone" }), _jsx(Typography, { variant: "body2", sx: { mb: 3, color: 'gray' }, children: "Train your mind like you train your strategy. Complete before and after each session." }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "h6", sx: { mb: 2, fontWeight: '600' }, children: "Pre-Session Warm-up" }), _jsx(TextField, { label: "What are your goals for this session?", value: preSessionGoals, onChange: (e) => setPreSessionGoals(e.target.value), fullWidth: true, multiline: true, rows: 2, sx: { mb: 2, textarea: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } } } }), _jsxs(Typography, { gutterBottom: true, children: ["Confidence Level: ", confidence, "/10"] }), _jsx(Slider, { value: confidence, onChange: (_, newValue) => setConfidence(newValue), min: 1, max: 10, step: 1, marks: true, sx: { color: '#9c27b0' } })] }), _jsx(Divider, { sx: { bgcolor: 'gray', my: 4 } }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h6", sx: { mb: 2, fontWeight: '600' }, children: "Post-Session Cool-down" }), _jsx(TextField, { label: "What were the key lessons from this session?", value: lessonsLearned, onChange: (e) => setLessonsLearned(e.target.value), fullWidth: true, multiline: true, rows: 3, sx: { mb: 2, textarea: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } } } }), _jsxs(Typography, { gutterBottom: true, children: ["Discipline Score: ", disciplineScore, "/10"] }), _jsx(Slider, { value: disciplineScore, onChange: (_, newValue) => setDisciplineScore(newValue), min: 1, max: 10, step: 1, marks: true, sx: { color: '#9c27b0' } }), _jsxs(Typography, { gutterBottom: true, children: ["Emotional Bias Score: ", emotionalBiasScore, "/100"] }), _jsx(Slider, { value: emotionalBiasScore, onChange: (_, newValue) => setEmotionalBiasScore(newValue), min: 0, max: 100, step: 1, sx: { color: '#9c27b0' } })] }), _jsx(Box, { sx: { mt: 4, textAlign: 'right' }, children: _jsx(Button, { onClick: handleSave, variant: "contained", sx: { bgcolor: '#9c27b0', ':hover': { bgcolor: '#7b1fa2' }, fontWeight: 'bold', py: 1.5 }, children: "Save Journal" }) })] }));
};
export default MindsetZone;
