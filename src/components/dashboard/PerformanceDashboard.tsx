
import { Box, Grid, Paper, Typography, Divider, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Round {
  id: string;
  status: string;
  profitOrLoss: number;
  emotion: string;
  game: string;
  userId: string;
  timestamp: Timestamp;
}

interface PerformanceMetric {
  name: string;
  winRate: number;
  totalProfit: number;
  rounds: number;
}

const PerformanceDashboard = () => {
  const [overallStats, setOverallStats] = useState({ winRate: 0, avgWin: 0, avgLoss: 0 });
  const [emotionStats, setEmotionStats] = useState<PerformanceMetric[]>([]);
  const [gameStats, setGameStats] = useState<PerformanceMetric[]>([]);
  const [dateRangeFilter, setDateRangeFilter] = useState('all-time');
  const [gameFilter, setGameFilter] = useState('all');

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    let roundsQuery = query(collection(db, "rounds"), where("userId", "==", user.uid));

    // Date Filter
    if (dateRangeFilter !== 'all-time') {
      const now = new Date();
      let startDate;
      if (dateRangeFilter === 'this-month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (dateRangeFilter === 'last-7-days') {
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
      }
      if (startDate) {
        roundsQuery = query(roundsQuery, where("timestamp", ">=", startDate));
      }
    }

    // Game Filter
    if (gameFilter !== 'all') {
      roundsQuery = query(roundsQuery, where("game", "==", gameFilter));
    }

    const unsubscribe = onSnapshot(roundsQuery, (querySnapshot) => {
      const rounds: Round[] = [];
      querySnapshot.forEach((doc) => {
        rounds.push({ id: doc.id, ...doc.data() } as Round);
      });

      if (rounds.length === 0) {
        setOverallStats({ winRate: 0, avgWin: 0, avgLoss: 0 });
        setEmotionStats([]);
        setGameStats([]);
        return;
      }

      // Overall Stats
      const wins = rounds.filter(r => r.status === "Cashed Out").length;
      const losses = rounds.length - wins;
      const totalProfit = rounds.reduce((acc, r) => acc + r.profitOrLoss, 0);
      const totalWinAmount = rounds.filter(r => r.status === "Cashed Out").reduce((acc, r) => acc + r.profitOrLoss, 0);
      const totalLossAmount = totalProfit - totalWinAmount;

      setOverallStats({
        winRate: (wins / rounds.length) * 100,
        avgWin: wins > 0 ? totalWinAmount / wins : 0,
        avgLoss: losses > 0 ? totalLossAmount / losses : 0,
      });

      // Stats by Emotion
      const emotionData = processGroupedData(rounds, 'emotion');
      setEmotionStats(emotionData);

      // Stats by Game
      if (gameFilter === 'all') {
        const gameData = processGroupedData(rounds, 'game');
        setGameStats(gameData);
      } else {
        setGameStats([]); // Don't show game stats when filtered by a specific game
      }
    });

    return () => unsubscribe();
  }, [user, dateRangeFilter, gameFilter]);

  const processGroupedData = (rounds: Round[], groupBy: keyof Round): PerformanceMetric[] => {
    const grouped: { [key: string]: Round[] } = {};
    rounds.forEach(round => {
      const key = round[groupBy] as string;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(round);
    });

    return Object.keys(grouped).map(key => {
      const groupRounds = grouped[key];
      const wins = groupRounds.filter(r => r.status === "Cashed Out").length;
      return {
        name: key,
        winRate: (wins / groupRounds.length) * 100,
        totalProfit: groupRounds.reduce((acc, r) => acc + r.profitOrLoss, 0),
        rounds: groupRounds.length
      };
    });
  };
  
  const StatCard = ({ label, value }: { label: string, value: string }) => (
    <Paper elevation={4} sx={{ p: 2, textAlign: 'center', borderRadius: 3, border: '1px solid #333' }}>
      <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
      <Typography variant="h6" fontWeight="bold">{value}</Typography>
    </Paper>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, backgroundColor: 'rgba(30,30,30,0.9)', borderRadius: 2 }}>
          <Typography variant="body2" fontWeight="bold">{`${label}`}</Typography>
          <Typography variant="caption" color="primary.main">{`Win Rate: ${payload[0].value.toFixed(0)}%`}</Typography><br/>
          <Typography variant="caption" color={payload[1].value >= 0 ? '#4caf50' : '#f44336'}>{`Profit: R${payload[1].value.toFixed(2)}`}</Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="700" color="primary.main" gutterBottom>
        Performance Dashboard 🚀
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRangeFilter}
              label="Date Range"
              onChange={(e) => setDateRangeFilter(e.target.value)}
            >
              <MenuItem value="all-time">All Time</MenuItem>
              <MenuItem value="last-7-days">Last 7 Days</MenuItem>
              <MenuItem value="this-month">This Month</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Game</InputLabel>
            <Select
              value={gameFilter}
              label="Game"
              onChange={(e) => setGameFilter(e.target.value)}
            >
              <MenuItem value="all">All Games</MenuItem>
              <MenuItem value="SkyCash">SkyCash</MenuItem>
              <MenuItem value="Red Rocket">Red Rocket</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Overall Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}><StatCard label="Overall Win Rate" value={`${overallStats.winRate.toFixed(0)}%`} /></Grid>
        <Grid item xs={12} sm={4}><StatCard label="Average Win" value={`+R${overallStats.avgWin.toFixed(2)}`} /></Grid>
        <Grid item xs={12} sm={4}><StatCard label="Average Loss" value={`R${overallStats.avgLoss.toFixed(2)}`} /></Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Grouped Stats */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={gameFilter === 'all' ? 6 : 12}>
          <Typography variant="h6" fontWeight="700" color="primary.main" gutterBottom>Performance by Emotion</Typography>
          <Paper elevation={4} sx={{ p: 2, borderRadius: 3, border: '1px solid #333' }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emotionStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis yAxisId="left" stroke="#888" label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft', fill: '#888' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#888" label={{ value: 'Total Profit (R)', angle: 90, position: 'insideRight', fill: '#888' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="winRate" fill="#00ff99" name="Win Rate" />
                <Bar yAxisId="right" dataKey="totalProfit" fill="#8884d8" name="Total Profit" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        {gameFilter === 'all' && (
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="700" color="primary.main" gutterBottom>Performance by Game</Typography>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, border: '1px solid #333' }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gameStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis yAxisId="left" stroke="#888" label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft', fill: '#888' }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#888" label={{ value: 'Total Profit (R)', angle: 90, position: 'insideRight', fill: '#888' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar yAxisId="left" dataKey="winRate" fill="#00ff99" name="Win Rate" />
                  <Bar yAxisId="right" dataKey="totalProfit" fill="#8884d8" name="Total Profit" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PerformanceDashboard;
