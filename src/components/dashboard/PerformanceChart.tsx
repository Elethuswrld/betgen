
import { Paper, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { db } from "../../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { chartPaperStyle } from "./styles";

interface Round {
  game: string;
  profit: number;
}

interface ChartData {
  name: string;
  profit: number;
}

const PerformanceChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const q = query(collection(db, "rounds"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const performance: { [key: string]: number } = {};
      querySnapshot.forEach((doc) => {
        const round = doc.data() as Round;
        if (round.game && typeof round.profit === 'number') {
            if (performance[round.game]) {
                performance[round.game] += round.profit;
            } else {
                performance[round.game] = round.profit;
            }
        }
      });

      const data = Object.keys(performance).map(game => ({
        name: game,
        profit: performance[game]
      }));

      setChartData(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Paper sx={chartPaperStyle}>
      <Typography variant="h6" fontWeight="700" color="primary.main" gutterBottom>Performance by Game</Typography>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff99" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00ccff" stopOpacity={0.8}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            <XAxis dataKey="name" stroke="#8b949e" />
            <YAxis stroke="#8b949e" />
            <Tooltip 
                wrapperStyle={{ backgroundColor: "#161b22", border: "1px solid #30363d" }} 
                contentStyle={{ color: '#c9d1d9' }}
            />
            <Bar dataKey="profit" fill="url(#colorProfit)" >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#00ff99' : '#d32f2f'} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default PerformanceChart;
