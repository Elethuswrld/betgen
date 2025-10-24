
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, Typography, TextField, Button, Grid, Box, CircularProgress } from '@mui/material';

const BankrollTracker = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user) return;
      const docRef = doc(db, 'bankrolls', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBalance(docSnap.data().balance);
      } else {
        await setDoc(docRef, { balance: 0 });
      }
      setLoading(false);
    };
    fetchBalance();
  }, [user]);

  const updateBalance = async (newBalance: number) => {
    if (!user) return;
    const docRef = doc(db, 'bankrolls', user.uid);
    await updateDoc(docRef, { balance: newBalance });
    setBalance(newBalance);
    setAmount('');
  };

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (!isNaN(depositAmount) && depositAmount > 0) {
      updateBalance(balance + depositAmount);
    }
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (!isNaN(withdrawAmount) && withdrawAmount > 0 && balance >= withdrawAmount) {
      updateBalance(balance - withdrawAmount);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ mb: 2 }}>
          Bankroll Tracker
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
          Current Balance: {balance.toFixed(2)}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Grid>
          <Grid xs={6}>
            <Button fullWidth variant="contained" color="success" onClick={handleDeposit}>
              Deposit
            </Button>
          </Grid>
          <Grid xs={6}>
            <Button fullWidth variant="contained" color="error" onClick={handleWithdraw}>
              Withdraw
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BankrollTracker;
