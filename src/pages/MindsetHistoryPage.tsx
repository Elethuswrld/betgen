
import React from 'react';
import useAuth from '../hooks/useAuth';
import useMindsetEntries from '../hooks/useMindsetEntries';
import {
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';

const MindsetHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const { entries, loading } = useMindsetEntries(user);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4, md: 6 } }}>
      <Paper
        elevation={12}
        sx={{
          p: { xs: 3, sm: 5 },
          margin: 'auto',
          maxWidth: '1000px',
          background: 'rgba(44, 26, 62, 0.7)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          border: '1px solid #9c27b0',
          boxShadow: '0 8px 32px 0 rgba(156, 39, 176, 0.37)',
          color: 'white',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', borderBottom: '2px solid #9c27b0', pb: 1, mb: 3 }}
        >
          Mindset Journal History
        </Typography>
        {entries.length === 0 ? (
          <Typography>No journal entries found. Start by adding one from the dashboard!</Typography>
        ) : (
          entries.map((entry) => (
            <Accordion
              key={entry.id}
              sx={{
                background: 'rgba(60, 30, 80, 0.8)',
                color: 'white',
                mb: 2,
                borderRadius: '12px',
                '&.Mui-expanded': { margin: '16px 0' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {format(entry.timestamp.toDate(), 'MMMM dd, yyyy - h:mm a')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Pre-Session
                    </Typography>
                    <Typography sx={{ color: '#c7c7c7' }}>Goals: {entry.preSessionGoals}</Typography>
                    <Chip label={`Confidence: ${entry.confidence}/10`} sx={{ mt: 1, bgcolor: '#7b1fa2' }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Post-Session
                    </Typography>
                    <Typography sx={{ color: '#c7c7c7' }}>Lessons: {entry.lessonsLearned}</Typography>
                    <Chip
                      label={`Discipline: ${entry.disciplineScore}/10`}
                      sx={{ mt: 1, mr: 1, bgcolor: '#7b1fa2' }}
                    />
                    <Chip
                      label={`Emotional Bias: ${entry.emotionalBiasScore}/100`}
                      sx={{ mt: 1, bgcolor: '#7b1fa2' }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Paper>
    </Box>
  );
};

export default MindsetHistoryPage;
