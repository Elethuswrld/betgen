
import { Grid, Paper, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import CountUp from 'react-countup';
import { db } from "../../firebase";
import { collection, onSnapshot, query, getDoc, doc } from "firebase/firestore";
import { statCardStyle } from "./styles";

interface Round {
  status: string;
  profit: number;
}

const KpiCards = () => {
  const [stats, setStats] = useState({
    currentBalance: 0,
    totalProfitLoss: 0,
    winRate: 0,
    bestStreak: 0,
  });

  useEffect(() => {
    const fetchSettingsAndRounds = async () => {
      const settingsDocRef = doc(db, "settings", "user_settings");
      const settingsDocSnap = await getDoc(settingsDocRef);
      const startingBankroll = settingsDocSnap.data()?.startingBankroll || 0;

      const q = query(collection(db, "rounds"));
      onSnapshot(q, (querySnapshot) => {
        const rounds: Round[] = querySnapshot.docs.map(doc => doc.data() as Round);

        let totalProfitLoss = 0;
        let winRate = 0;
        let bestStreak = 0;

        if (rounds.length > 0) {
          const wins = rounds.filter(r => r.status === "Cashed Out").length;
          totalProfitLoss = rounds.reduce((acc, r) => acc + (isFinite(r.profit) ? r.profit : 0), 0);
          winRate = (wins / rounds.length) * 100;

          let currentStreak = 0;
          rounds.forEach(r => {
            if (r.status === "Cashed Out") {
              currentStreak++;
            } else {
              if (currentStreak > bestStreak) {
                bestStreak = currentStreak;
              }
              currentStreak = 0;
            }
          });
          if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
          }
        }

        setStats({
          currentBalance: startingBankroll + totalProfitLoss,
          totalProfitLoss,
          winRate,
          bestStreak,
        });
      });
    };

    fetchSettingsAndRounds();
  }, []);

  const StatCard = ({ label, value, prefix, suffix, color, decimals }: { label: string, value: number, prefix?: string, suffix?: string, color?: string, decimals?: number }) => (
    <Paper sx={statCardStyle}>
      <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ color }}>
        <CountUp end={value} prefix={prefix} suffix={suffix} decimals={decimals} duration={1.5} />
      </Typography>
    </Paper>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard label="Current Balance" value={stats.currentBalance} prefix="R" decimals={2} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard 
            label="Total Profit/Loss" 
            value={stats.totalProfitLoss} 
            prefix="R" 
            decimals={2} 
            color={stats.totalProfitLoss >= 0 ? 'success.main' : 'error.main'} 
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard 
            label="Win Rate" 
            value={stats.winRate} 
            suffix="%" 
            decimals={0} 
            color={stats.winRate >= 50 ? 'success.main' : 'error.main'} 
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard label="Best Streak" value={stats.bestStreak} suffix=" Wins" />
      </Grid>
    </Grid>
  );
};

export default KpiCards;
