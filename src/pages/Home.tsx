
import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import KpiCards from "../components/dashboard/KpiCards";
import BankrollChart from "../components/dashboard/BankrollChart";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import RecentBetsTable from "../components/dashboard/RecentBetsTable";
import MotivationalBanner from "../components/dashboard/MotivationalBanner";
import RoundLogger from "../components/dashboard/RoundLogger";
import BalanceManager from "../components/dashboard/BalanceManager";

const Home = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the logged-in user's ID
    // For now, we'll use a placeholder
    setUserId("placeholderUserId");
  }, []);

  if (!userId) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MotivationalBanner />
      </Grid>
      <Grid item xs={12}>
        <KpiCards userId={userId} />
      </Grid>
      <Grid item xs={12} md={8}>
        <BankrollChart userId={userId} />
      </Grid>
      <Grid item xs={12} md={4}>
        <RoundLogger userId={userId} />
      </Grid>
      <Grid item xs={12} md={6}>
        <PerformanceChart userId={userId} />
      </Grid>
      <Grid item xs={12} md={6}>
        <BalanceManager userId={userId} />
      </Grid>
      <Grid item xs={12}>
        <RecentBetsTable userId={userId} />
      </Grid>
    </Grid>
  );
};

export default Home;
