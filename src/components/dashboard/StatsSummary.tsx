
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { mockSummary } from "../../mockData";

const StatsSummary = () => {
  const { totalProfit, winRate, totalBets } = mockSummary;

  const stats = [
    { title: "Total Profit", value: `$${totalProfit.toFixed(2)}` },
    { title: "Win Rate", value: `${winRate.toFixed(2)}%` },
    { title: "Total Bets", value: totalBets },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Card sx={{ bgcolor: "background.paper", borderRadius: "12px" }}>
            <CardContent>
              <Typography sx={{ color: "text.secondary" }}>{stat.title}</Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsSummary;
