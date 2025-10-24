
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, model } from '../../firebase';
import { Paper, Typography, Box, CircularProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Lightbulb, TrendingUp, TrendingDown, SentimentVeryDissatisfied, Psychology } from '@mui/icons-material';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const getIconForRecommendation = (rec: string) => {
    const lowerRec = rec.toLowerCase();
    if (lowerRec.includes('win rate') || lowerRec.includes('profitable')) return <TrendingUp color="success" />;
    if (lowerRec.includes('loss') || lowerRec.includes('losing')) return <TrendingDown color="error" />;
    if (lowerRec.includes('tilted') || lowerRec.includes('emotional')) return <SentimentVeryDissatisfied color="warning" />;
    if (lowerRec.includes('mindset') || lowerRec.includes('focus')) return <Psychology color="info" />;
    return <Lightbulb color="primary" />;
  };

  useEffect(() => {
    const generateRecommendations = async () => {
      try {
        setLoading(true);
        const roundsSnapshot = await getDocs(collection(db, 'rounds'));
        const rounds = roundsSnapshot.docs.map(doc => doc.data());

        if (rounds.length < 20) { // Require more data for meaningful recommendations
            setRecommendations(["Log at least 20 rounds to unlock AI-powered strategy recommendations."]);
            setLoading(false);
            return;
        }

        // Basic analysis (can be expanded)
        const totalPL = rounds.reduce((acc, r) => acc + r.profitOrLoss, 0);
        const winRate = (rounds.filter(r => r.status === 'Cashed Out').length / rounds.length) * 100;
        const analysis = {
            totalRounds: rounds.length,
            overallProfitLoss: totalPL,
            overallWinRate: winRate,
            recentRounds: rounds.slice(-20), // Focus on recent performance
        };

        const prompt = `
          As a head trading coach for a professional gambler, analyze the following performance summary.
          The user tracks their bets like trades. Your goal is to provide a short, bulleted list of 2-3 highly specific, actionable recommendations to improve their performance.

          Performance Summary:
          ${JSON.stringify(analysis, null, 2)}

          Instructions:
          1.  Identify the user's biggest strengths, weaknesses, or most impactful patterns from the data.
          2.  Generate 2-3 distinct recommendations based on these patterns.
          3.  Each recommendation must be a single, concise sentence.
          4.  Speak directly to the user ("You should...", "Consider...", "Focus on...").
          5.  Format the output as a valid JSON array of strings. Example: ["Recommendation 1", "Recommendation 2"]

          Example Recommendations:
          - "Your win rate is highest when you play 'Crash'; consider focusing more of your sessions there."
          - "The data shows your largest losses happen after 10 PM; try setting a hard stop-loss time."
          - "You tend to chase losses after a losing streak; focus on your pre-session goal of disciplined betting."
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        
        const parsedRecommendations = JSON.parse(text);
        setRecommendations(parsedRecommendations);

      } catch (error) {
        console.error("Error generating recommendations:", error);
        setRecommendations(["Could not generate recommendations at this time. Please try again later."]);
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, []);

  return (
    <Paper elevation={4} sx={{ p: 3, borderRadius: 3, border: '1px solid #333', mt: 3, backgroundColor: 'primary.dark' }}>
      <Typography variant="h6" fontWeight="700" color="primary.main" gutterBottom>
        📈 AI Strategy Recommendations
      </Typography>
      <Box sx={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {recommendations.map((rec, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {getIconForRecommendation(rec)}
                </ListItemIcon>
                <ListItemText primary={rec} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default Recommendations;
