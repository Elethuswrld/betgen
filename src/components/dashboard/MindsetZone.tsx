
import { Box, Button, Grid, MenuItem, Paper, Select, TextField, Typography, Divider } from "@mui/material";
import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const MindsetZone = () => {
  const [warmUp, setWarmUp] = useState({
    mentalState: "",
    goal: "",
    stopLoss: "",
  });

  const [coolDown, setCoolDown] = useState({
    outcome: "",
    reflection: "",
    lessons: "",
  });

  const handleWarmUpChange = (e: any) => {
    const { name, value } = e.target;
    setWarmUp(prev => ({ ...prev, [name]: value }));
  };

  const handleCoolDownChange = (e: any) => {
    const { name, value } = e.target;
    setCoolDown(prev => ({ ...prev, [name]: value }));
  };

  const saveSession = async (sessionData: any, type: string) => {
    try {
      await addDoc(collection(db, "sessions"), {
        type,
        ...sessionData,
        timestamp: serverTimestamp(),
      });
      alert(`${type} saved successfully!`);
      if(type === 'Warm-up') setWarmUp({ mentalState: '', goal: '', stopLoss: '' });
      if(type === 'Cool-down') setCoolDown({ outcome: '', reflection: '', lessons: '' });
    } catch (error) {
      console.error("Error saving session: ", error);
      alert("Error saving session.");
    }
  };

  const SessionForm = ({ title, fields, data, handleChange, onSave, type }: any) => (
    <Paper elevation={4} sx={{ p: 3, borderRadius: 3, border: '1px solid #333', height: '100%' }}>
      <Typography variant="h6" fontWeight="700" color="primary.main" gutterBottom>{title}</Typography>
      <Grid container spacing={2}>
        {fields.map((field: any) => (
          <Grid item xs={12} key={field.name}>
            {field.type === 'select' ? (
              <Select
                fullWidth
                variant="outlined"
                name={field.name}
                value={data[field.name]}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value="" disabled><em>{field.label}</em></MenuItem>
                {field.options.map((option: string) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
              </Select>
            ) : (
              <TextField
                fullWidth
                variant="outlined"
                name={field.name}
                label={field.label}
                value={data[field.name]}
                onChange={handleChange}
                type={field.type || 'text'}
                multiline={field.multiline || false}
                rows={field.rows || 1}
              />
            )}
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        onClick={() => onSave(data, type)}
        sx={{ mt: 3, bgcolor: "primary.main", color: "#000", "&:hover": { bgcolor: "primary.dark" } }}
      >
        Save {type}
      </Button>
    </Paper>
  );

  const warmUpFields = [
    { name: 'mentalState', label: 'How are you feeling?', type: 'select', options: ['Calm & Focused', 'Excited & Eager', 'Anxious & Hesitant', 'Fatigued & Distracted', 'Tilted & Impulsive'] },
    { name: 'goal', label: 'What is your primary goal for this session?', multiline: true, rows: 2 },
    { name: 'stopLoss', label: 'What is your session Stop-Loss (in R)?', type: 'number' },
  ];

  const coolDownFields = [
    { name: 'outcome', label: 'Session Outcome', type: 'select', options: ['Hit Profit Target', 'Reached Stop-Loss', 'Ended at Breakeven', 'Small Win', 'Small Loss'] },
    { name: 'reflection', label: 'How disciplined were you?', multiline: true, rows: 2 },
    { name: 'lessons', label: 'What is one key lesson learned?', multiline: true, rows: 2 },
  ];

  return (
    <Box sx={{ p: 3 }}>
       <Typography variant="h5" fontWeight="700" color="primary.main" gutterBottom>
        Mindset Zone 🧠
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Use these tools to cultivate self-awareness and enforce discipline before and after every session.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <SessionForm title="Pre-Session Warm-up 🔥" fields={warmUpFields} data={warmUp} handleChange={handleWarmUpChange} onSave={saveSession} type="Warm-up" />
        </Grid>
        <Grid item xs={12} md={6}>
          <SessionForm title="Post-Session Cool-down ❄️" fields={coolDownFields} data={coolDown} handleChange={handleCoolDownChange} onSave={saveSession} type="Cool-down" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MindsetZone;
