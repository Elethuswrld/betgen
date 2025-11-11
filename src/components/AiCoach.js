import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Typography, Box, Chip } from '@mui/material';
import MindsetChart from './MindsetChart';
const AiCoach = ({ crashGames, mindsetEntries }) => {
    const generateInsights = () => {
        if (crashGames.length < 5) {
            return ["Log at least 5 games to start receiving AI-powered insights."];
        }
        const insights = [];
        // Insight 1: Win/Loss Streak
        let consecutiveLosses = 0;
        for (let i = crashGames.length - 1; i >= 0; i--) {
            if (crashGames[i].outcome === 'loss') {
                consecutiveLosses++;
            }
            else {
                break;
            }
        }
        if (consecutiveLosses >= 3) {
            insights.push(`You've lost ${consecutiveLosses} games in a row. Consider taking a break to reset your mindset.`);
        }
        // Insight 2: High-Risk Behavior
        const highRiskGames = crashGames.filter(game => game.cashOutMultiplier > 5);
        if (highRiskGames.length > crashGames.length / 2) {
            insights.push("A majority of your recent games have been high-risk (over 5x multiplier). Ensure you're comfortable with this strategy.");
        }
        // Insight 3: Mindset vs. Performance
        const tiltedLosses = crashGames.filter(game => game.mindset === 'Tilted' && game.outcome === 'loss');
        if (tiltedLosses.length > 2) {
            insights.push("You've lost several games while feeling 'Tilted'. It might be a good idea to step away when you're in this mindset.");
        }
        const focusedWins = crashGames.filter(game => game.mindset === 'Focused' && game.outcome === 'win');
        if (focusedWins.length > 3) {
            insights.push("You have a great track record while 'Focused'. Keep cultivating that state of mind!");
        }
        // Insight 4: Discipline & Performance
        if (mindsetEntries.length > 0 && crashGames.length > 0) {
            const latestMindset = mindsetEntries[0];
            const recentGames = crashGames.filter(game => game.timestamp.toMillis() > latestMindset.timestamp.toMillis());
            if (recentGames.length > 3) {
                const totalProfit = recentGames.reduce((acc, game) => acc + game.profit, 0);
                if (latestMindset.disciplineScore < 5 && totalProfit < 0) {
                    insights.push("Your discipline score was low in your last session, and you've lost money since. Focus on sticking to your plan.");
                }
                if (latestMindset.confidence > 7 && totalProfit > 0) {
                    insights.push("Your confidence was high, and it's paying off! Keep up the great work.");
                }
            }
        }
        return insights.length > 0 ? insights : ["No specific patterns detected right now. Keep logging to get more insights!"];
    };
    const insights = generateInsights();
    return (_jsxs(Paper, { elevation: 3, sx: {
            p: 3,
            bgcolor: '#2c1a3e',
            color: 'white',
            mt: 4,
            borderRadius: '16px',
            border: '1px solid #9c27b0',
        }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, sx: { fontWeight: 'bold' }, children: "AI Coach" }), _jsxs(Box, { sx: { mt: 4 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, sx: { fontWeight: '600' }, children: "Performance by Mindset" }), _jsx(MindsetChart, { crashGames: crashGames })] }), _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, sx: { fontWeight: '600' }, children: "Insights" }), insights.map((insight, index) => (_jsx(Chip, { label: insight, sx: {
                            bgcolor: '#3a3a3a',
                            color: 'white',
                            p: 2.5,
                            height: 'auto',
                            '& .MuiChip-label': {
                                whiteSpace: 'normal',
                                fontWeight: '500'
                            },
                            border: '1px solid #5a5a5a'
                        } }, index)))] })] }));
};
export default AiCoach;
