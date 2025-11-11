
import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import KpiCards from "../components/KpiCards";
import BankrollChart from "../components/BankrollChart";
import PerformanceChart from "../components/PerformanceChart";
import RecentBetsTable from "../components/RecentBetsTable";
import MotivationalBanner from "../components/MotivationalBanner";
import RoundLogger from "../components/RoundLogger";
import BalanceManager from "../components/BalanceManager";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const Home = () => {
  const [user] = useAuthState(auth);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MotivationalBanner />
      </Grid>
      <Grid item xs={12}>
        <KpiCards userId={user.uid} />
      </Grid>
      <Grid item xs={12} md={8}>
        <BankrollChart userId={user.uid} />
      </Grid>
      <Grid item xs={12} md={4}>
        <RoundLogger userId={user.uid} />
      </Grid>
      <Grid item xs={12} md={6}>
        <PerformanceChart userId={user.uid} />
      </Grid>
      <Grid item xs={12} md={6}>
        <BalanceManager userId={user.uid} />
      </Grid>
      <Grid item xs={12}>
        <RecentBetsTable userId={user.uid} />
      </Grid>
    </Grid>
  );
};

export default Home;
