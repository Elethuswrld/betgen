
import { Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const quotes = [
    "The secret of getting ahead is getting started.",
    "The only place where success comes before work is in the dictionary.",
    "Don't watch the clock; do what it does. Keep going.",
    "The best way to predict the future is to create it.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts."
];

const MotivationalBanner = () => {
    const [currentQuote, setCurrentQuote] = useState(quotes[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            setCurrentQuote(quotes[randomIndex]);
        }, 10000); // Change quote every 10 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <Paper elevation={4} sx={{ 
            p: 2, 
            mb: 3, 
            textAlign: 'center', 
            background: 'linear-gradient(45deg, #00ff99 30%, #00ccff 90%)',
            color: '#0d1117',
            fontStyle: 'italic'
        }}>
            <Typography variant="h6">{currentQuote}</Typography>
        </Paper>
    );
};

export default MotivationalBanner;
