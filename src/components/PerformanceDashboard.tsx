
import React, { useMemo } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Tooltip,
  Box,
  CircularProgress,
} from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import useAuth from '../hooks/useAuth';
import useAnalytics from '../hooks/useAnalytics';

// --- TYPE DEFINITIONS ---

interface Round {
  id?: string;
  profit: number;
  timestamp: Timestamp;
  outcome: 'win' | 'loss';
}

interface PerformanceDashboardProps {
  rounds: Round[];
}

// --- STYLED COMPONENT FOR AI CARDS ---

const AiInsightCard = ({
  title,
  value,
  unit,
  tooltip,
  glowColor = '#00FFC6',
}: {
  title: string;
  value: string;
  unit?: string;
  tooltip: string;
  glowColor?: string;
}) => (
  <Tooltip title={tooltip} placement="top">
    <Paper
      sx={{
        p: 2,
        textAlign: 'center',
        color: 'white',
        borderRadius: '16px',
        height: '100%',
        background: 'rgba(27, 27, 39, 0.7)', // Glassmorphism background
        backdropFilter: 'blur(10px)',
        border: `1px solid ${glowColor}`,
        animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px) scale(1.03)',
          boxShadow: `0 0 25px 3px ${glowColor}`,
        },
      }}
    >
      <Typography variant="h4" className="font-orbitron font-bold">
        {value}
        {unit && (
          <Typography component="span" variant="h6" sx={{ ml: 0.5 }}>
            {unit}
          </Typography>
        )}
      </Typography>
      <Typography variant="body2" sx={{ color: '#c7c7c7' }}>
        {title}
      </Typography>
    </Paper>
  </Tooltip>
);

// --- MAIN COMPONENT ---

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ rounds }) => {
  const { user } = useAuth();
  const { analytics, loading } = useAnalytics(user);

  const bankrollData = useMemo(() => {
    return rounds
      .slice()
      .reverse()
      .reduce((acc, round, index) => {
        const previousBankroll = acc.length > 0 ? acc[acc.length - 1].bankroll : 0;
        acc.push({
          name: `R${index + 1}`,
          profit: round.profit,
          bankroll: previousBankroll + round.profit,
        });
        return acc;
      }, [] as { name: string; profit: number; bankroll: number }[]);
  }, [rounds]);

  return (
    <Paper
      elevation={12}
      sx={{
        p: { xs: 2, md: 3 },
        mt: 4,
        color: 'white',
        border: '1px solid #4B00FF',
        borderRadius: '20px',
        background: 'rgba(10, 10, 20, 0.5)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <Typography variant="h5" gutterBottom className="font-orbitron font-bold">
        AI Performance Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#00FFC6' }} />
        </Box>
      ) : !analytics ? (
        <Typography sx={{ textAlign: 'center', my: 4, color: '#c7c7c7' }}>
          Log your first round to see AI insights.
        </Typography>
      ) : (
        <Box>
          <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={6} sm={6} md={3}>
              <AiInsightCard
                title="Win Rate"
                value={analytics.winRate.toFixed(1)}
                unit="%"
                tooltip="Percentage of rounds won"
                glowColor="#00FFC6"
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <AiInsightCard
                title="Avg. Multiplier"
                value={analytics.avgMultiplier.toFixed(2)}
                unit="x"
                tooltip="Your average winning multiplier"
                glowColor="#00C4FF"
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <AiInsightCard
                title="Risk/Reward"
                value={analytics.riskRewardRatio.toFixed(2)}
                unit=""
                tooltip="Ratio of average win to average loss"
                glowColor="#FFD700"
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <AiInsightCard
                title="Best Range"
                value={analytics.bestRange}
                unit="x"
                tooltip="The multiplier range where you are most profitable"
                glowColor="#FF6B00"
              />
            </Grid>
          </Grid>
          <Tooltip title={analytics.performanceSummary} placement="top">
            <Paper
              sx={{
                p: 2,
                mb: 4,
                textAlign: 'center',
                color: 'white',
                borderRadius: '16px',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(75, 0, 255, 0.3), rgba(0, 255, 198, 0.2))',
                border: `1px solid #4B00FF`,
                boxShadow: `0 0 20px 0px #4B00FF`,
              }}
            >
              <Typography variant="body1" className="font-orbitron font-bold mb-1">
                &#x1F4A1; AI Suggestion
              </Typography>
              <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
                {analytics.aiSuggestion}
              </Typography>
            </Paper>
          </Tooltip>
        </Box>
      )}

      <Typography variant="h6" className="font-orbitron font-bold mt-4 mb-2">
        Bankroll Progression
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={bankrollData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(75, 0, 255, 0.3)" />
          <XAxis dataKey="name" stroke="#c7c7c7" />
          <YAxis yAxisId="left" stroke="#00FFC6" />
          <YAxis yAxisId="right" orientation="right" stroke="#FFD700" />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: 'rgba(27, 27, 39, 0.9)',
              backdropFilter: 'blur(5px)',
              border: '1px solid #00FFC6',
              color: 'white',
            }}
            formatter={(value: number, name: string) =>
              name === 'Profit' ? `$${value.toFixed(2)}` : `$${value.toFixed(2)}`
            }
          />
          <Legend wrapperStyle={{ color: 'white' }} />
          <Bar yAxisId="right" dataKey="profit" name="Profit">
            {bankrollData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#00C4FF' : '#FF6B00'} />
            ))}
          </Bar>
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="bankroll"
            name="Bankroll"
            stroke="#00FFC6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 8, style: { fill: '#fff', stroke: '#00FFC6' } }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default PerformanceDashboard;
