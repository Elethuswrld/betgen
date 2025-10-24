
import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db, auth } from '../firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, Typography, Grid, CircularProgress, Box } from '@mui/material';

const PerformanceDashboard = () => {
  const user = auth.currentUser;
  const [value, loading, error] = useCollection(
    query(collection(db, 'rounds'), where('userId', '==', user ? user.uid : ''))
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  const rounds = value ? value.docs.map(doc => doc.data()) : [];

  const totalProfit = rounds.reduce((acc, round) => acc + round.profit, 0);
  const totalRounds = rounds.length;
  const totalWins = rounds.filter(round => round.profit > 0).length;
  const winRate = totalRounds > 0 ? (totalWins / totalRounds) * 100 : 0;
  const averageMultiplier = totalRounds > 0 ? rounds.reduce((acc, round) => acc + round.actualCashout, 0) / totalRounds : 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ mb: 2 }}>
          Performance Dashboard
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Total Profit</Typography>
              <Typography variant="h4" color={totalProfit >= 0 ? 'success.main' : 'error.main'}>
                {totalProfit.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Win Rate</Typography>
              <Typography variant="h4">{winRate.toFixed(2)}%</Typography>
            </Box>
          </Grid>
          <Grid xs={12}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Total Rounds</Typography>
              <Typography variant="h4">{totalRounds}</Typography>
            </Box>
          </Grid>
          <Grid xs={12}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Avg. Multiplier</Typography>
              <Typography variant="h4">{averageMultiplier.toFixed(2)}x</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PerformanceDashboard;
