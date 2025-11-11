
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import useAuth from '../hooks/useAuth';
import useAnalytics from '../hooks/useAnalytics';

const AiStrategyPanel: React.FC = () => {
  const { user } = useAuth();
  const { analytics, loading } = useAnalytics(user);

  const handleAskAi = () => {
    console.log("Opening AI Chat...");
    // In a real implementation, this would trigger a modal or navigate to the chat view
  };

  const getRiskColor = (rating: number) => {
    if (rating < 40) return '#00ff00'; // Green for low risk
    if (rating < 70) return '#ffff00'; // Yellow for medium risk
    return '#f44336'; // Red for high risk
  };

  if (loading) {
    return <CircularProgress color="secondary" />;
  }

  if (!analytics) {
    return <Typography>No analytics data available yet.</Typography>;
  }

  const riskColor = getRiskColor(analytics.riskRating || 0);

  return (
    <Paper
      sx={{
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
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        AI Strategy Panel
      </Typography>

      <Box sx={{ my: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Today's Summary
        </Typography>
        <Typography>
          Rounds: {analytics.totalRounds} | Win Rate: {analytics.winRate.toFixed(1)}% | P/L: ${analytics.totalProfitLoss.toFixed(2)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Risk Rating
        </Typography>
        <Tooltip title="Your current bankroll volatility risk">
          <Box sx={{ color: riskColor, fontWeight: 'bold', fontSize: '1.5rem' }}>
            {analytics.riskRating?.toFixed(0)}
          </Box>
        </Tooltip>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Suggested Action
        </Typography>
        <Typography>🤖 {analytics.suggestedAction}</Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        onClick={handleAskAi}
        sx={{
          mt: 2,
          bgcolor: '#9c27b0',
          fontWeight: 'bold',
          py: 1.5,
          boxShadow: '0 0 15px #9c27b0',
          ':hover': {
            bgcolor: '#7b1fa2',
            boxShadow: '0 0 25px #9c27b0',
          },
        }}
      >
        Ask AI for Advice
      </Button>
    </Paper>
  );
};

export default AiStrategyPanel;
