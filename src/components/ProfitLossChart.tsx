
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Paper, Typography } from '@mui/material';

const ProfitLossChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "rounds"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chartData = snapshot.docs.map((doc, index) => ({
        name: `Round ${index + 1}`,
        profit: doc.data().profit,
      }));
      setData(chartData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Profit/Loss Per Round
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="profit">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#82ca9d' : '#ff6b6b'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ProfitLossChart;
