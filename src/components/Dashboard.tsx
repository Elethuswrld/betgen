
import React from 'react';
import { Grid, Typography } from '@mui/material';
import RoundLogger from './RoundLogger';
import History from './History';
import PerformanceDashboard from './PerformanceDashboard';
import BankrollTracker from './BankrollTracker';

const Dashboard = () => {
  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid xs={12}>
        <Typography variant="h4" component="h1" gutterBottom>
          Betting Dashboard
        </Typography>
      </Grid>
      <Grid xs={12}>
        <PerformanceDashboard />
      </Grid>
      <Grid xs={12}>
        <BankrollTracker />
      </Grid>
      <Grid xs={12}>
        <RoundLogger />
      </Grid>
      <Grid xs={12}>
        <History />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
