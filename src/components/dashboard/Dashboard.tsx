
import { Container, Grid, Box } from "@mui/material";
import KpiCards from "./KpiCards";
import BankrollChart from "./BankrollChart";
import PerformanceChart from "./PerformanceChart";
import RecentBetsTable from "./RecentBetsTable";
import RoundLogger from "./RoundLogger";
import MotivationalBanner from "./MotivationalBanner";

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, py: 4, backgroundColor: 'background.default' }}>
        <Container maxWidth="xl">
            <MotivationalBanner />
            <Grid container spacing={3}>
                {/* KPI Cards spanning the full width */}
                <Grid item xs={12}>
                    <KpiCards />
                </Grid>

                {/* Charts side-by-side */}
                <Grid item xs={12} md={6}>
                    <BankrollChart />
                </Grid>
                <Grid item xs={12} md={6}>
                    <PerformanceChart />
                </Grid>

                {/* Recent Bets Table and Round Logger */}
                <Grid item xs={12} lg={8}>
                    <RecentBetsTable />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <RoundLogger />
                </Grid>
            </Grid>
        </Container>
    </Box>
  );
};

export default Dashboard;
