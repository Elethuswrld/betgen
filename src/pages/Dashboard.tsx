
import { Box, Grid } from "@mui/material";
import BankrollChart from "../components/dashboard/BankrollChart";
import KpiCards from "../components/dashboard/KpiCards";
import RoundLogger from "../components/dashboard/RoundLogger";
import BehavioralInsights from "../components/dashboard/BehavioralInsights";
import Recommendations from "../components/dashboard/Recommendations";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import RecentBetsTable from "../components/dashboard/RecentBetsTable";

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <KpiCards />
        </Grid>
        <Grid item md={6} xs={12}>
          <BehavioralInsights />
        </Grid>
        <Grid item md={6} xs={12}>
          <Recommendations />
        </Grid>
        <Grid item xs={12} md={6}>
          <BankrollChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <PerformanceChart />
        </Grid>
        <Grid item xs={12}>
          <RecentBetsTable />
        </Grid>
        <Grid item xs={12}>
          <RoundLogger />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
