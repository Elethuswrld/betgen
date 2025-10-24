
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";

interface Bet {
  id: string;
  game: string;
  betAmount: number;
  cashOutAmount: number;
  profit: number;
  status: string;
}

const RecentBetsTable = () => {
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    const q = query(collection(db, "rounds"), orderBy("timestamp", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const betsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Bet));
      setBets(betsData);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "Cashed Out") return 'success.main';
    if (status === "Busted") return 'error.main';
    return 'text.primary';
  };

  return (
    <Paper elevation={4} sx={{ p: 2, borderRadius: 3, border: '1px solid #30363d', backgroundColor: '#161b22' }}>
        <Typography variant="h6" fontWeight="700" color="primary.main" gutterBottom>Recent Rounds</Typography>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: '#8b949e'}}>Game</TableCell>
                        <TableCell sx={{ color: '#8b949e'}} align="right">Bet</TableCell>
                        <TableCell sx={{ color: '#8b949e'}} align="right">Cashout</TableCell>
                        <TableCell sx={{ color: '#8b949e'}} align="right">Profit</TableCell>
                        <TableCell sx={{ color: '#8b949e'}} align="right">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bets.map((bet) => (
                        <TableRow key={bet.id}>
                            <TableCell sx={{ color: '#c9d1d9'}}>{bet.game}</TableCell>
                            <TableCell sx={{ color: '#c9d1d9'}} align="right">R{bet.betAmount}</TableCell>
                            <TableCell sx={{ color: '#c9d1d9'}} align="right">{bet.cashOutAmount}x</TableCell>
                            <TableCell sx={{ color: (bet.profit || 0) >= 0 ? 'success.main' : 'error.main'}} align="right">R{(bet.profit || 0).toFixed(2)}</TableCell>
                            <TableCell sx={{ color: getStatusColor(bet.status)}} align="right">{bet.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
  );
};

export default RecentBetsTable;
