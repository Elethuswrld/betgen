
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { neonGradientButtonStyle } from "./styles";

const RoundLogger = () => {
  const [game, setGame] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [cashOutAmount, setCashOutAmount] = useState("");
  const [status, setStatus] = useState("Cashed Out");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bet = parseFloat(betAmount);
    const cashOut = parseFloat(cashOutAmount);
    const profit = status === "Cashed Out" ? (bet * cashOut) - bet : -bet;

    await addDoc(collection(db, "rounds"), {
      game,
      betAmount: bet,
      cashOutAmount: cashOut,
      profit,
      status,
      timestamp: serverTimestamp(),
    });

    // Reset form
    setGame("");
    setBetAmount("");
    setCashOutAmount("");
    setStatus("Cashed Out");
  };

  return (
    <Paper elevation={4} sx={{ p: 3, borderRadius: 3, border: '1px solid #30363d', backgroundColor: '#161b22' }}>
      <Typography variant="h6" fontWeight="700" color="primary.main" gutterBottom>Log a New Round</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField 
            label="Game (e.g., Aviator, Crash)" 
            value={game} 
            onChange={(e) => setGame(e.target.value)} 
            required 
        />
        <TextField 
            label="Bet Amount (R)" 
            type="number" 
            value={betAmount} 
            onChange={(e) => setBetAmount(e.target.value)} 
            required 
        />
        <TextField 
            label="Cashout Multiplier (e.g., 1.5)" 
            type="number" 
            value={cashOutAmount} 
            onChange={(e) => setCashOutAmount(e.target.value)} 
            required={status === 'Cashed Out'}
            disabled={status === 'Busted'}
        />
        <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="Cashed Out">Cashed Out</MenuItem>
                <MenuItem value="Busted">Busted</MenuItem>
            </Select>
        </FormControl>
        <Button type="submit" variant="contained" sx={neonGradientButtonStyle}>Log Round</Button>
      </Box>
    </Paper>
  );
};

export default RoundLogger;
