
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where } from 'firebase/firestore';
import { Card, CardContent, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FlightLandIcon from '@mui/icons-material/FlightLand';

const RoundLogger = () => {
  const [gameName, setGameName] = useState('SkyCash');
  const [betAmount, setBetAmount] = useState('');
  const [targetMultiplier, setTargetMultiplier] = useState('');
  const [actualCashout, setActualCashout] = useState('');
  const [notes, setNotes] = useState('');
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    const bet = parseFloat(betAmount);
    const cashoutMultiplier = parseFloat(actualCashout);
    if (!isNaN(bet)) {
      if (!isNaN(cashoutMultiplier)) {
        setProfit((cashoutMultiplier * bet) - bet);
      } else {
        setProfit(0 - bet);
      }
    } else {
      setProfit(0);
    }
  }, [betAmount, actualCashout]);

  const clearForm = () => {
    setBetAmount('');
    setTargetMultiplier('');
    setActualCashout('');
    setNotes('');
    setProfit(0);
  };

  const logRound = async (isLoss = false) => {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to log a round.");
        return;
    }

    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0) {
      alert("Please enter a valid bet amount.");
      return;
    }

    const cashoutMultiplier = isLoss ? 0 : parseFloat(actualCashout);
    if (!isLoss && (isNaN(cashoutMultiplier) || cashoutMultiplier < 0)) {
        alert("Please enter a valid actual cashout multiplier.");
        return;
    }

    const calculatedProfit = (cashoutMultiplier * bet) - bet;

    try {
      await addDoc(collection(db, "rounds"), {
        userId: user.uid,
        gameName,
        betAmount: bet,
        targetMultiplier: parseFloat(targetMultiplier) || 0,
        actualCashout: cashoutMultiplier,
        profit: calculatedProfit,
        notes,
        timestamp: new Date(),
      });
      clearForm();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logRound(false);
  };

  const handleLoss = (e: React.MouseEvent) => {
    e.preventDefault();
    logRound(true);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ mb: 2 }}>
          Log a Round
        </Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Game Name</InputLabel>
                <Select
                  value={gameName}
                  label="Game Name"
                  onChange={(e) => setGameName(e.target.value)}
                >
                  <MenuItem value="SkyCash">SkyCash</MenuItem>
                  <MenuItem value="RedRocket">RedRocket</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Bet Amount"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Target Multiplier"
                value={targetMultiplier}
                onChange={(e) => setTargetMultiplier(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Actual Cashout Multiplier"
                value={actualCashout}
                onChange={(e) => setActualCashout(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ mr: 2 }}>
                Profit/Loss:
              </Typography>
              <Typography variant="h6" color={profit >= 0 ? 'success.main' : 'error.main'}>
                {profit.toFixed(2)}
              </Typography>
              {profit >= 0 ? <TrendingUpIcon color="success" sx={{ ml: 1 }} /> : <TrendingDownIcon color="error" sx={{ ml: 1 }} />}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleSubmit}
              >
                Log Win
              </Button>
            </Grid>
             <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<FlightLandIcon />}
                onClick={handleLoss}
              >
                Flew Away / Loss
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoundLogger;
