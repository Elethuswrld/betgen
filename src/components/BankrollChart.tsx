
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';
import { format } from 'date-fns';

const BankrollChart = () => {
  const [data, setData] = useState([]);
  const startingBalance = 1000;

  useEffect(() => {
    const q = query(collection(db, "rounds"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let currentBalance = startingBalance;
      const chartData = snapshot.docs.map(doc => {
        const round = doc.data();
        currentBalance += round.profit;
        return {
          name: format(round.timestamp.toDate(), 'MMM d'),
          bankroll: currentBalance,
        };
      });
      setData(chartData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Bankroll Over Time
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="bankroll" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default BankrollChart;
