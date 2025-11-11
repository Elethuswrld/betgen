import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Box, TextField, Button, Avatar, CircularProgress } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AIStrategyEngine from '../services/aiStrategyEngine';
// --- STYLED COMPONENTS & ANIMATIONS ---
const sharedBubbleStyles = {
    p: 1.5,
    height: 'auto',
    color: 'white',
    borderRadius: '20px',
    maxWidth: '80%',
    '& .MuiChip-label': {
        whiteSpace: 'normal',
        textAlign: 'left'
    },
    animation: 'fadeIn 0.3s ease-in-out',
    '@keyframes fadeIn': {
        from: { opacity: 0, transform: 'scale(0.95)' },
        to: { opacity: 1, transform: 'scale(1)' },
    },
};
const UserBubble = (props) => (_jsx(Box, { sx: { ...sharedBubbleStyles, background: 'linear-gradient(45deg, #8e2de2, #4a00e0)' }, ...props, children: props.text }));
const AiBubble = (props) => (_jsx(Box, { sx: { ...sharedBubbleStyles, background: 'linear-gradient(45deg, #02aab0, #00cdac)' }, ...props, children: props.text }));
const AiChat = () => {
    const [user] = useAuthState(auth);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        if (user) {
            const q = query(collection(db, `users/${user.uid}/chat`), orderBy('timestamp'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const msgs = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setMessages(msgs);
                scrollToBottom();
            });
            return () => unsubscribe();
        }
    }, [user]);
    const getAiResponse = async (userInput) => {
        if (!user)
            return "I can't seem to access your data. Are you logged in?";
        const engine = new AIStrategyEngine(user.uid);
        const analytics = await engine.runFullAnalysis(); // Ensure we have latest data
        const lowerCaseInput = userInput.toLowerCase();
        if (lowerCaseInput.includes('how am i doing') || lowerCaseInput.includes('summary')) {
            return `Here's your quick summary 🔥: 
            - Win Rate: ${analytics.winRate.toFixed(1)}%
            - Total Profit/Loss: $${analytics.totalProfitLoss.toFixed(2)}
            - Your biggest insight right now is: ${analytics.insights[0] || 'Keep playing to find out!'}`;
        }
        if (lowerCaseInput.includes('best multiplier') || lowerCaseInput.includes('best range')) {
            const prediction = engine.predictOptimalMultiplier();
            return `Based on my analysis, your optimal multiplier range is around ${prediction.range}. I predict this with ${prediction.confidence}% confidence. Stick to it! 💪`;
        }
        if (lowerCaseInput.includes('weak spot') || lowerCaseInput.includes('weakness')) {
            const bias = analytics.insights.find(i => i.toLowerCase().includes('tilted') || i.toLowerCase().includes('discipline'));
            return bias ? `It seems like your biggest challenge is emotional control. ${bias} Let's work on that together. 😎` : `I'm not seeing any major weak spots right now. Keep up the disciplined play!`;
        }
        if (lowerCaseInput.includes('strategy') || lowerCaseInput.includes('give me a plan')) {
            const prediction = engine.predictOptimalMultiplier();
            return `Alright, let's get strategic. For the next 10 rounds, I suggest this plan: 
            1. Target a multiplier in the ${prediction.range} range. 
            2. Keep your bet size consistent. 
            3. If you lose 2 in a row, take a 5-minute break. 
            Execute with precision! 💡`;
        }
        return `I'm still learning, but I've logged your question: "${userInput}". Ask me about your performance, weak spots, or for a strategy!`;
    };
    const handleSendMessage = async () => {
        if (input.trim() === '' || !user)
            return;
        const userMessageText = input;
        setInput('');
        // Add user message to Firestore
        await addDoc(collection(db, `users/${user.uid}/chat`), { text: userMessageText, sender: 'user', timestamp: serverTimestamp() });
        setIsThinking(true);
        const aiResponseText = await getAiResponse(userMessageText);
        setIsThinking(false);
        // Add AI response to Firestore
        await addDoc(collection(db, `users/${user.uid}/chat`), { text: aiResponseText, sender: 'ai', timestamp: serverTimestamp() });
    };
    return (_jsxs(Paper, { elevation: 3, sx: { p: 3, mt: 4, bgcolor: '#2c1a3e', color: 'white', borderRadius: '16px', border: '1px solid #9c27b0' }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, sx: { fontWeight: 'bold' }, children: "AI Chat" }), _jsxs(Box, { sx: { height: '400px', overflowY: 'auto', p: 2, mb: 2, bgcolor: '#1a1a1a', borderRadius: '8px' }, children: [messages.map((msg, index) => (_jsxs(Box, { sx: { display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', mb: 2 }, children: [msg.sender === 'ai' && _jsx(Avatar, { sx: { bgcolor: '#00cdac', mr: 1.5, boxShadow: '0 0 10px #00cdac' }, children: "AI" }), msg.sender === 'user' ? _jsx(UserBubble, { text: msg.text }) : _jsx(AiBubble, { text: msg.text }), msg.sender === 'user' && _jsx(Avatar, { sx: { bgcolor: '#8e2de2', ml: 1.5, boxShadow: '0 0 10px #8e2de2' }, children: "E" })] }, index))), isThinking && (_jsxs(Box, { sx: { display: 'flex', justifyContent: 'flex-start', mb: 2 }, children: [_jsx(Avatar, { sx: { bgcolor: '#00cdac', mr: 1.5 }, children: "AI" }), _jsx(Typography, { sx: { color: '#c7c7c7', fontStyle: 'italic' }, children: "AI is thinking..." })] })), _jsx("div", { ref: messagesEndRef })] }), _jsxs(Box, { sx: { display: 'flex' }, children: [_jsx(TextField, { value: input, onChange: (e) => setInput(e.target.value), fullWidth: true, variant: "outlined", placeholder: "Ask the AI Coach a question...", sx: { input: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } } }, onKeyPress: (e) => e.key === 'Enter' && handleSendMessage(), disabled: isThinking }), _jsx(Button, { onClick: handleSendMessage, variant: "contained", sx: { ml: 2, bgcolor: '#9c27b0', ':hover': { bgcolor: '#7b1fa2' } }, disabled: isThinking, children: isThinking ? _jsx(CircularProgress, { size: 24, color: "inherit" }) : 'Send' })] })] }));
};
export default AiChat;
