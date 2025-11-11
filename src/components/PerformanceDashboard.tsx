
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Grid, Tooltip, Box, CircularProgress } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AIStrategyEngine from '../services/aiStrategyEngine';

// --- TYPE DEFINITIONS ---
interface CrashGame {
  outcome: 'win' | 'loss';
  game: string;
  cashOutMultiplier: number;
  profit: number;
  timestamp: any;
}

interface Analytics {
    totalRounds: number;
    winRate: number;
    averageMultiplier: number;
    totalProfitLoss: number;
    bestStreak: number;
    worstStreak: number;
    emotionalBiasScore: number;
    lastAnalyzed: Timestamp;
    insights: string[];
}

interface PerformanceDashboardProps {
  crashGames: CrashGame[];
}

const COLORS = { win: '#4caf50', loss: '#f44336' };

// --- STYLED COMPONENT FOR AI CARDS ---
const AiCard = ({ title, value, unit, tooltip, glowColor = '#9c27b0' }: any) => (
    <Tooltip title={tooltip}>
        <Paper sx={{
            p: 2,
            textAlign: 'center',
            bgcolor: '#2c1a3e',
            color: 'white',
            borderRadius: '12px',
            border: `1px solid ${glowColor}`,
            boxShadow: `0 0 15px ${glowColor}`,
            height: '100%',
            animation: 'fadeIn 0.5s ease-in-out',
            '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'translateY(10px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
            },
        }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}<Typography component="span" variant="h6">{unit}</Typography></Typography>
            <Typography variant="body2" sx={{ color: '#c7c7c7' }}>{title}</Typography>
        </Paper>
    </Tooltip>
);


const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ crashGames }) => {
    const [user] = useAuthState(auth);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [optimalRange, setOptimalRange] = useState({ range: 'N/A', confidence: 0 });

    useEffect(() => {
        if (user) {
            const engine = new AIStrategyEngine(user.uid);
            setOptimalRange(engine.predictOptimalMultiplier()); // Set initial prediction

            const unsubscribe = onSnapshot(doc(db, 'users', user.uid, 'analytics', 'latest'), (doc) => {
                if (doc.exists()) {
                    setAnalytics(doc.data() as Analytics);
                    // Optionally re-predict on new analysis
                    setOptimalRange(engine.predictOptimalMultiplier());
                }
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user]);

    // Existing chart logic...
    const totalGames = crashGames.length;
    const wins = crashGames.filter(g => g.outcome === 'win').length;
    const losses = totalGames - wins;
    const winLossData = [{ name: 'Wins', value: wins }, { name: 'Losses', value: losses }];
    const profitData = crashGames.slice().reverse().map((game, index) => ({ name: `G${index + 1}`, profit: game.profit }));

    // --- CALCULATIONS FOR NEW CARDS ---
    const winRate = analytics ? analytics.winRate.toFixed(1) : '0.0';
    const expectedValue = analytics ? ((analytics.winRate / 100) * (analytics.averageMultiplier - 1) - ((1 - analytics.winRate / 100) * 1)).toFixed(3) : '0.000';
    const aiRecommendation = analytics && analytics.insights.length > 0 ? analytics.insights[0] : 'Log more games to get insights.';

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4, bgcolor: '#1a1a1a', color: 'white', border: '1px solid #444', borderRadius: '16px' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>AI Performance Dashboard</Typography>
      
      {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress color="secondary" /></Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}><AiCard title="Win Rate" value={winRate} unit="%" tooltip="Percentage of games won" /></Grid>
            <Grid item xs={12} sm={6} md={3}><AiCard title="Optimal Range" value={optimalRange.range} unit="" tooltip={`Predicted best multiplier range with ${optimalRange.confidence}% confidence`} glowColor="#00cyan"/></Grid>
            <Grid item xs={12} sm={6} md={3}><AiCard title="Expected Value (EV)" value={expectedValue} unit="%" tooltip="Average return on every 1 unit bet" glowColor="#00ff00" /></Grid>
            <Grid item xs={12} sm={6} md={3}>
                 <Tooltip title="A suggestion from your AI Coach">
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#2c1a3e', color: 'white', borderRadius: '12px', border: `1px solid #ffff00`, boxShadow: `0 0 15px #ffff00`, height: '100%', animation: 'fadeIn 0.5s ease-in-out' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>💡 AI Recommendation</Typography>
                        <Typography variant="body2" sx={{ color: '#c7c7c7' }}>{aiRecommendation}</Typography>
                    </Paper>
                </Tooltip>
            </Grid>
        </Grid>
      )}

      <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>Game History Analysis</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>Win/Loss Distribution</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={winLossData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {winLossData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value) => `${value} (${((value as number / totalGames) * 100).toFixed(1)}%)`} />
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>Profit Over Time</Typography>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={profitData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="name" stroke="white" />
                    <YAxis stroke="white" />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#3a3a3a', color: 'white' }} formatter={(value: number) => `$${value.toFixed(2)}`}/>
                    <Line type="monotone" dataKey="profit" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PerformanceDashboard;
