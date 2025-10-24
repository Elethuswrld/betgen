
import { Paper, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy, getDoc, doc } from "firebase/firestore";
import { chartPaperStyle } from "./styles";

interface Round {
  timestamp: any;
  profit: number;
}

interface ChartData {
  name: string;
  balance: number;
}

const BankrollChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [startingBankroll, setStartingBankroll] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "settings", "user_settings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStartingBankroll(docSnap.data().startingBankroll || 0); // Fallback to 0
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (typeof startingBankroll !== 'number') return;

    const q = query(collection(db, "rounds"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let currentBalance = startingBankroll;
      const data: ChartData[] = [{ name: 'Start', balance: startingBankroll }];

      querySnapshot.forEach((doc, index) => {
        const round = doc.data() as Round;
        if (typeof round.profit === 'number') {
            currentBalance += round.profit;
            data.push({ name: `Round ${index + 1}`, balance: currentBalance });
        }
      });
      setChartData(data);
    });

    return () => unsubscribe();
  }, [startingBankroll]);

  return (
    <Paper sx={chartPaperStyle}>
        <Typography variant="h6" fontWeight="700" color="primary.main" gutterBottom>Bankroll Over Time</Typography>
        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00ff99" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#00ff99" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis dataKey="name" stroke="#8b949e" />
                    <YAxis stroke="#8b949e" domain={['dataMin - 100', 'dataMax + 100']} />
                    <Tooltip 
                        wrapperStyle={{ backgroundColor: "#161b22", border: "1px solid #30363d" }} 
                        contentStyle={{ color: '#c9d1d9' }}
                    />
                    <Area type="monotone" dataKey="balance" stroke="#00ff99" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    </Paper>
  );
};

export default BankrollChart;
