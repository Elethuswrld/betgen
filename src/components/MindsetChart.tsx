
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Timestamp } from 'firebase/firestore';

interface CrashGame {
    id?: string;
    game: string;
    amount: number;
    cashOutMultiplier: number;
    crashPoint: number;
    outcome: 'win' | 'loss';
    profit: number;
    notes: string;
    mindset: string;
    timestamp: Timestamp;
}

interface MindsetChartProps {
  crashGames: CrashGame[];
}

const MindsetChart: React.FC<MindsetChartProps> = ({ crashGames }) => {
  const processData = () => {
    const mindsets = ['Neutral', 'Focused', 'Greedy', 'Tilted', 'Disciplined'];
    const data = mindsets.map(mindset => ({
      name: mindset,
      profit: 0,
    }));

    crashGames.forEach(game => {
      const index = data.findIndex(d => d.name === game.mindset);
      if (index !== -1) {
        data[index].profit += game.profit;
      }
    });

    return data;
  };

  const data = processData();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="name" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
        <Legend wrapperStyle={{ color: '#fff' }} />
        <Bar dataKey="profit" fill="#9c27b0" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MindsetChart;
