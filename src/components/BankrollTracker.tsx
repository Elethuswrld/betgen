
import React from 'react';
import { Paper, Typography, Box, CircularProgress, Tooltip } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface UserProfile {
  startingBalance: number;
  currentBalance: number;
  totalProfitLoss: number;
  riskProfile: string;
  goals: string;
}

interface BankrollTrackerProps {
  profile: UserProfile | null;
}

const BankrollTracker: React.FC<BankrollTrackerProps> = ({ profile }) => {
  if (!profile) {
    return (
        <Paper elevation={3} sx={{ p: 3, bgcolor: '#2a2a2a', color: 'white', textAlign: 'center', borderRadius: '16px' }}>
            <CircularProgress color="secondary" />
            <Typography sx={{ mt: 2 }}>Loading Bankroll...</Typography>
        </Paper>
    );
  }

  const { currentBalance, totalProfitLoss, startingBalance } = profile;
  const isProfit = totalProfitLoss >= 0;
  const percentageChange = startingBalance > 0 ? (totalProfitLoss / startingBalance) * 100 : 0;

  return (
    <Paper 
        elevation={3} 
        sx={{ 
            p: 3, 
            mb: 4, 
            bgcolor: '#2c1a3e', 
            color: 'white',
            borderRadius: '16px',
            border: '1px solid #9c27b0',
            boxShadow: '0 0 20px rgba(156, 39, 176, 0.5)',
        }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Bankroll</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
        <Typography variant="h3" component="p" sx={{ fontWeight: 'bold' }}>
          ${currentBalance.toFixed(2)}
        </Typography>
        <Tooltip title={`Since starting balance of $${startingBalance}`}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: isProfit ? '#4caf50' : '#f44336' }}>
            {isProfit ? <ArrowUpward fontSize="large"/> : <ArrowDownward fontSize="large"/>}
            <Typography variant="h5" component="p" sx={{ ml: 1, fontWeight: 'bold' }}>
                {percentageChange.toFixed(2)}%
            </Typography>
            </Box>
        </Tooltip>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body1" color={isProfit ? '#4caf50' : '#f44336'} sx={{ fontWeight: '500' }}>
            Total P/L: ${totalProfitLoss.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="gray">
            Starting Balance: ${startingBalance.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default BankrollTracker;
