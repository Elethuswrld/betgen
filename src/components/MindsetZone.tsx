
import React, { useState } from 'react';
import { Paper, Typography, Box, Button, TextField, Slider, Divider } from '@mui/material';

interface MindsetJournalEntry {
    preSessionGoals: string;
    confidence: number;
    lessonsLearned: string;
    disciplineScore: number;
    emotionalBiasScore: number;
}

interface MindsetZoneProps {
    onSave: (entry: MindsetJournalEntry) => void;
}

const MindsetZone: React.FC<MindsetZoneProps> = ({ onSave }) => {
  // States for pre-session
  const [preSessionGoals, setPreSessionGoals] = useState('');
  const [confidence, setConfidence] = useState(7);

  // States for post-session
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [disciplineScore, setDisciplineScore] = useState(7);
  const [emotionalBiasScore, setEmotionalBiasScore] = useState(50);

  const handleSave = () => {
    onSave({ preSessionGoals, confidence, lessonsLearned, disciplineScore, emotionalBiasScore });
    // Reset fields
    setPreSessionGoals('');
    setConfidence(7);
    setLessonsLearned('');
    setDisciplineScore(7);
    setEmotionalBiasScore(50);
  };

  return (
    <Paper 
        elevation={3} 
        sx={{ 
            p: 4, 
            mt: 4, 
            bgcolor: '#2c1a3e', 
            color: 'white', 
            borderRadius: '16px',
            border: '1px solid #9c27b0'
        }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>🧘 Mindset Zone</Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'gray' }}>
        Train your mind like you train your strategy. Complete before and after each session.
      </Typography>

      {/* Pre-Session */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: '600' }}>Pre-Session Warm-up</Typography>
        <TextField
          label="What are your goals for this session?"
          value={preSessionGoals}
          onChange={(e) => setPreSessionGoals(e.target.value)}
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 2, textarea: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } } }}
        />
        <Typography gutterBottom>Confidence Level: {confidence}/10</Typography>
        <Slider
          value={confidence}
          onChange={(_, newValue) => setConfidence(newValue as number)}
          min={1}
          max={10}
          step={1}
          marks
          sx={{ color: '#9c27b0' }}
        />
      </Box>

      <Divider sx={{ bgcolor: 'gray', my: 4 }} />

      {/* Post-Session */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: '600' }}>Post-Session Cool-down</Typography>
        <TextField
          label="What were the key lessons from this session?"
          value={lessonsLearned}
          onChange={(e) => setLessonsLearned(e.target.value)}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2, textarea: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } } }}
        />
        <Typography gutterBottom>Discipline Score: {disciplineScore}/10</Typography>
        <Slider
          value={disciplineScore}
          onChange={(_, newValue) => setDisciplineScore(newValue as number)}
          min={1}
          max={10}
          step={1}
          marks
          sx={{ color: '#9c27b0' }}
        />
        <Typography gutterBottom>Emotional Bias Score: {emotionalBiasScore}/100</Typography>
        <Slider
          value={emotionalBiasScore}
          onChange={(_, newValue) => setEmotionalBiasScore(newValue as number)}
          min={0}
          max={100}
          step={1}
          sx={{ color: '#9c27b0' }}
        />
      </Box>

      <Box sx={{ mt: 4, textAlign: 'right' }}>
        <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#9c27b0', ':hover': { bgcolor: '#7b1fa2' }, fontWeight: 'bold', py: 1.5 }}>
          Save Journal
        </Button>
      </Box>
    </Paper>
  );
};

export default MindsetZone;
