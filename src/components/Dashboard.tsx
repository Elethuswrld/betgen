
import React from 'react';
import { Grid, Typography } from '@mui/material';
import RoundLogger from './RoundLogger';
import History from './History';
import PerformanceDashboard from './PerformanceDashboard';
import BankrollTracker from './BankrollTracker';

const Dashboard = () => {
  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" gutterBottom>
          Betting Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <PerformanceDashboard />
      </Grid>
      <Grid item xs={12} md={6}>
        <BankrollTracker />
      </Grid>
      <Grid item xs={12} md={6}>
        <RoundLogger />
      </Grid>
      <Grid item xs={12} md={6}>
        <History />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
