
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Slider,
  Divider,
} from '@mui/material';

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
  const [entry, setEntry] = useState<MindsetJournalEntry>({
    preSessionGoals: '',
    confidence: 7,
    lessonsLearned: '',
    disciplineScore: 7,
    emotionalBiasScore: 50,
  });

  const handleChange = (field: keyof MindsetJournalEntry, value: any) => {
    setEntry((prevEntry) => ({ ...prevEntry, [field]: value }));
  };

  const handleSave = () => {
    onSave(entry);
    setEntry({
      preSessionGoals: '',
      confidence: 7,
      lessonsLearned: '',
      disciplineScore: 7,
      emotionalBiasScore: 50,
    });
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
        border: '1px solid #9c27b0',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        🧘 Mindset Zone
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'gray' }}>
        Train your mind like you train your strategy. Complete before and after each session.
      </Typography>

      {/* Pre-Session */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: '600' }}>
          Pre-Session Warm-up
        </Typography>
        <TextField
          label="What are your goals for this session?"
          value={entry.preSessionGoals}
          onChange={(e) => handleChange('preSessionGoals', e.target.value)}
          fullWidth
          multiline
          rows={2}
          sx={{
            mb: 2,
            textarea: { color: 'white' },
            label: { color: 'gray' },
            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } },
          }}
        />
        <Typography gutterBottom>Confidence Level: {entry.confidence}/10</Typography>
        <Slider
          value={entry.confidence}
          onChange={(_, newValue) => handleChange('confidence', newValue as number)}
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
        <Typography variant="h6" sx={{ mb: 2, fontWeight: '600' }}>
          Post-Session Cool-down
        </Typography>
        <TextField
          label="What were the key lessons from this session?"
          value={entry.lessonsLearned}
          onChange={(e) => handleChange('lessonsLearned', e.target.value)}
          fullWidth
          multiline
          rows={3}
          sx={{
            mb: 2,
            textarea: { color: 'white' },
            label: { color: 'gray' },
            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } },
          }}
        />
        <Typography gutterBottom>Discipline Score: {entry.disciplineScore}/10</Typography>
        <Slider
          value={entry.disciplineScore}
          onChange={(_, newValue) => handleChange('disciplineScore', newValue as number)}
          min={1}
          max={10}
          step={1}
          marks
          sx={{ color: '#9c27b0' }}
        />
        <Typography gutterBottom>Emotional Bias Score: {entry.emotionalBiasScore}/100</Typography>
        <Slider
          value={entry.emotionalBiasScore}
          onChange={(_, newValue) => handleChange('emotionalBiasScore', newValue as number)}
          min={0}
          max={100}
          step={1}
          sx={{ color: '#9c27b0' }}
        />
      </Box>

      <Box sx={{ mt: 4, textAlign: 'right' }}>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ bgcolor: '#9c27b0', ':hover': { bgcolor: '#7b1fa2' }, fontWeight: 'bold', py: 1.5 }}
        >
          Save Journal
        </Button>
      </Box>
    </Paper>
  );
};

export default MindsetZone;
