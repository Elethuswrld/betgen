
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, model } from '../../firebase';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

const BehavioralInsights = () => {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsight = async () => {
      try {
        setLoading(true);
        const roundsSnapshot = await getDocs(collection(db, 'rounds'));
        const rounds = roundsSnapshot.docs.map(doc => doc.data());

        if (rounds.length < 10) {
            setInsight("Log at least 10 rounds to unlock AI-powered behavioral insights.");
            setLoading(false);
            return;
        }

        const emotionStats: { [key: string]: { wins: number; losses: number; totalPL: number; count: number } } = {};

        rounds.forEach(round => {
          const emotion = round.emotion || "Untagged";
          if (!emotionStats[emotion]) {
            emotionStats[emotion] = { wins: 0, losses: 0, totalPL: 0, count: 0 };
          }
          emotionStats[emotion].count++;
          emotionStats[emotion].totalPL += round.profitOrLoss;

          if (round.status === 'Cashed Out') {
            emotionStats[emotion].wins++;
          } else {
            emotionStats[emotion].losses++;
          }
        });
        
        const analysis = Object.entries(emotionStats).map(([emotion, stats]) => ({
            emotion,
            winRate: (stats.wins / stats.count) * 100,
            totalPL: stats.totalPL,
            count: stats.count,
        }));

        const prompt = `
          As a professional gambling psychology coach, analyze the following betting data which links emotions to performance.
          The data shows win rates and profit/loss (P/L) for different emotional states.

          Data:
          ${JSON.stringify(analysis, null, 2)}

          Based on this data, identify the single most impactful behavioral pattern.
          This could be the emotion leading to the biggest losses, the lowest win rate, or the most success.
          Provide a concise, actionable insight for the user in a single sentence.
          Speak directly to the user ("You...").
          For example: "When you feel Tilted, your win rate drops significantly; consider taking a break when this emotion arises."
          Another example: "Your calmest sessions are your most profitable; lean into that mindset."
          If there's no strong pattern, give a general encouraging message.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        setInsight(text);

      } catch (error) {
        console.error("Error generating insight:", error);
        setInsight("Could not generate an insight at this time. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    generateInsight();
  }, []);

  return (
    <Paper elevation={4} sx={{ p: 3, borderRadius: 3, border: '1px solid #333', mt: 3, backgroundColor: 'primary.dark' }}>
      <Typography variant="h6" fontWeight="700" color="primary.main" gutterBottom>
        🧠 AI Behavioral Insight
      </Typography>
      <Box sx={{ minHeight: '50px', display: 'flex', alignItems: 'center' }}>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
            {insight}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default BehavioralInsights;
