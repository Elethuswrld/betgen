import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Typography, Box, CircularProgress, Tooltip } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
const BankrollTracker = ({ profile }) => {
    if (!profile) {
        return (_jsxs(Paper, { elevation: 3, sx: { p: 3, bgcolor: '#2a2a2a', color: 'white', textAlign: 'center', borderRadius: '16px' }, children: [_jsx(CircularProgress, { color: "secondary" }), _jsx(Typography, { sx: { mt: 2 }, children: "Loading Bankroll..." })] }));
    }
    const { currentBalance, totalProfitLoss, startingBalance } = profile;
    const isProfit = totalProfitLoss >= 0;
    const percentageChange = startingBalance > 0 ? (totalProfitLoss / startingBalance) * 100 : 0;
    return (_jsxs(Paper, { elevation: 3, sx: {
            p: 3,
            mb: 4,
            bgcolor: '#2c1a3e',
            color: 'white',
            borderRadius: '16px',
            border: '1px solid #9c27b0',
            boxShadow: '0 0 20px rgba(156, 39, 176, 0.5)',
        }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, sx: { fontWeight: 'bold' }, children: "Bankroll" }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }, children: [_jsxs(Typography, { variant: "h3", component: "p", sx: { fontWeight: 'bold' }, children: ["$", currentBalance.toFixed(2)] }), _jsx(Tooltip, { title: `Since starting balance of $${startingBalance}`, children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', color: isProfit ? '#4caf50' : '#f44336' }, children: [isProfit ? _jsx(ArrowUpward, { fontSize: "large" }) : _jsx(ArrowDownward, { fontSize: "large" }), _jsxs(Typography, { variant: "h5", component: "p", sx: { ml: 1, fontWeight: 'bold' }, children: [percentageChange.toFixed(2), "%"] })] }) })] }), _jsxs(Box, { sx: { textAlign: 'right' }, children: [_jsxs(Typography, { variant: "body1", color: isProfit ? '#4caf50' : '#f44336', sx: { fontWeight: '500' }, children: ["Total P/L: $", totalProfitLoss.toFixed(2)] }), _jsxs(Typography, { variant: "body2", color: "gray", children: ["Starting Balance: $", startingBalance.toFixed(2)] })] })] }));
};
export default BankrollTracker;
