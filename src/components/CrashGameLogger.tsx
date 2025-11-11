
import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Paper, Slider, Select, MenuItem, InputLabel, FormControl, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { analyzeUserPerformance } from '../services/aiStrategyEngine';

// --- TYPE DEFINITIONS ---
interface CrashGame {
  game: string;
  amount: number;
  cashOutMultiplier: number;
  crashPoint: number;
  outcome: 'win' | 'loss';
  notes: string;
  mindset: string;
  reasonForEntry: string;
}

interface CrashGameLoggerProps {
  onAddCrashGame: (crashGame: Omit<CrashGame, 'outcome'>) => void;
}


const CrashGameLogger: React.FC<CrashGameLoggerProps> = ({ onAddCrashGame }) => {
    const [user] = useAuthState(auth);
    const [game, setGame] = useState('aviator');
    const [amount, setAmount] = useState(0);
    const [cashOutMultiplier, setCashOutMultiplier] = useState(1.5);
    const [crashPoint, setCrashPoint] = useState(0);
    const [notes, setNotes] = useState('');
    const [mindset, setMindset] = useState('Neutral');
    const [reasonForEntry, setReasonForEntry] = useState('');
    const [logType, setLogType] = useState('cashout');

    const triggerPostRoundAnalysis = async () => {
        if (!user) return;
        await analyzeUserPerformance(user.uid);
        
        // The analysis result is now stored in Firestore, so we don't need to get a top insight here.
        // We can, however, still post a generic message to the chat.
        const chatMessage = `💡 Quick insight after your last round has been generated. Check the analytics dashboard!`;
        await addDoc(collection(db, `users/${user.uid}/chat`), { 
            text: chatMessage, 
            sender: 'ai', 
            timestamp: serverTimestamp() 
        });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const gameData = {
        game,
        amount,
        cashOutMultiplier: logType === 'cashout' ? cashOutMultiplier : 0,
        crashPoint: logType === 'crash' ? crashPoint : cashOutMultiplier,
        notes,
        mindset,
        reasonForEntry,
      };
    onAddCrashGame(gameData);
    
    // Trigger AI analysis after logging the game
    await triggerPostRoundAnalysis();

    // Reset form
    setAmount(0);
    setCashOutMultiplier(1.5);
    setCrashPoint(0);
    setNotes('');
    setMindset('Neutral');
    setReasonForEntry('');
  };

  const handleLogTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newLogType: string,
  ) => {
    if (newLogType !== null) {
      setLogType(newLogType);
    }
  };

  return (
    <Paper 
        elevation={3} 
        sx={{ 
            p: 4, 
            mb: 4, 
            bgcolor: '#2c1a3e', 
            color: 'white', 
            borderRadius: '16px',
            border: '1px solid #9c27b0'
        }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#f5f5f5' }}>Log a Crash Game</Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
            <ToggleButtonGroup
                color="secondary"
                value={logType}
                exclusive
                onChange={handleLogTypeChange}
                aria-label="Log Type"
                fullWidth
                sx={{ 
                    mb: 2,
                    '& .MuiToggleButtonGroup-grouped': {
                        color: 'white',
                        borderColor: '#9c27b0',
                        '&.Mui-selected': {
                            backgroundColor: '#9c27b0',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#7b1fa2'
                            }
                        },
                        '&:not(.Mui-selected):hover': {
                            backgroundColor: 'rgba(156, 39, 176, 0.2)'
                        }
                    }
                }}
            >
                <ToggleButton value="cashout">Cashout</ToggleButton>
                <ToggleButton value="crash">Crash</ToggleButton>
            </ToggleButtonGroup>

        <FormControl fullWidth>
        <InputLabel id="game-select-label" sx={{ color: 'gray' }}>Game</InputLabel>
          <Select
            labelId="game-select-label"
            value={game}
            label="Game"
            onChange={(e) => setGame(e.target.value)}
            sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#9c27b0' }, '& .MuiSvgIcon-root': { color: 'white' } }}
          >
            <MenuItem value="aviator">Aviator</MenuItem>
            <MenuItem value="skycash">Skycash</MenuItem>
            <MenuItem value="xride">XRide</MenuItem>
            <MenuItem value="redrocket">Red Rocket</MenuItem>
          </Select>
          </FormControl>
          <TextField 
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            required 
            sx={{ input: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } } }}
          />

        {logType === 'cashout' ? (
            <>
                <Typography gutterBottom>Cash-out Multiplier: {cashOutMultiplier}x</Typography>
                <Slider
                    value={cashOutMultiplier}
                    onChange={(_, newValue) => setCashOutMultiplier(newValue as number)}
                    min={1.01}
                    max={100}
                    step={0.01}
                    sx={{ color: '#9c27b0' }}
                />
            </>        ) : (
            <TextField 
                label="Crash Point"
                type="number"
                value={crashPoint}
                onChange={(e) => setCrashPoint(parseFloat(e.target.value))}
                required 
                sx={{ input: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } } }}
            />
        )}

            <FormControl fullWidth>
            <InputLabel id="mindset-select-label" sx={{ color: 'gray' }}>Mindset</InputLabel>
            <Select
                labelId="mindset-select-label"
                value={mindset}
                label="Mindset"
                onChange={(e) => setMindset(e.target.value)}
                sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#9c27b0' }, '& .MuiSvgIcon-root': { color: 'white' } }}
            >
                <MenuItem value="Neutral">Neutral</MenuItem>
                <MenuItem value="Focused">Focused</MenuItem>
                <MenuItem value="Greedy">Greedy</MenuItem>
                <MenuItem value="Tilted">Tilted</MenuItem>
                <MenuItem value="Disciplined">Disciplined</MenuItem>
            </Select>
            </FormControl>
            <TextField 
                label="Reason for Entry"
                value={reasonForEntry}
                onChange={(e) => setReasonForEntry(e.target.value)}
                fullWidth 
                sx={{ input: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } } }}
            />
          <TextField 
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth 
            sx={{ input: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c27b0' } } }}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2, bgcolor: '#9c27b0', ':hover': { bgcolor: '#7b1fa2' }, fontWeight: 'bold', py: 1.5 }}>
            Log Game
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CrashGameLogger;
