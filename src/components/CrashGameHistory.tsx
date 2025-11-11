
import React, { useState } from 'react';
import { Typography, Paper, Box, Card, CardContent, Chip, IconButton, Modal, Button, TextField, Select, MenuItem, InputLabel, FormControl, Slider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
  reasonForEntry: string;
  timestamp: Timestamp;
}

interface CrashGameHistoryProps {
  crashGames: CrashGame[];
  onDeleteGame: (id: string) => void;
  onUpdateGame: (id: string, updatedGame: Partial<CrashGame>) => void;
}

const EditGameModal: React.FC<{ 
    game: CrashGame | null;
    onClose: () => void;
    onSave: (updatedGame: Partial<CrashGame>) => void;
}> = ({ game, onClose, onSave }) => {
    const [editedGame, setEditedGame] = useState<Partial<CrashGame> | null>(game);

    const handleSave = () => {
        if(editedGame) {
            onSave(editedGame);
            onClose();
        }
    };

    if (!game || !editedGame) return null;

    return (
        <Modal open={!!game} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: '#3a3a3a', color: 'white', margin: 'auto', mt: '10%', width: '90%', maxWidth: 500 }}>
                <Typography variant="h6" gutterBottom>Edit Game</Typography>
                <TextField
                    label="Amount"
                    type="number"
                    value={editedGame.amount}
                    onChange={(e) => setEditedGame({ ...editedGame, amount: parseFloat(e.target.value) })}
                    fullWidth
                    sx={{ my: 1, input: { color: 'white' }, label: { color: 'gray' } }}
                />
                <Typography gutterBottom>Cash-out Multiplier: {editedGame.cashOutMultiplier}x</Typography>
                <Slider
                    value={editedGame.cashOutMultiplier}
                    onChange={(_, newValue) => setEditedGame({ ...editedGame, cashOutMultiplier: newValue as number })}
                    min={1.01}
                    max={100}
                    step={0.01}
                    sx={{ color: '#9c27b0' }}
                />
                <TextField
                    label="Crash Point"
                    type="number"
                    value={editedGame.crashPoint}
                    onChange={(e) => setEditedGame({ ...editedGame, crashPoint: parseFloat(e.target.value) })}
                    fullWidth
                    sx={{ my: 1, input: { color: 'white' }, label: { color: 'gray' } }}
                />
                <FormControl fullWidth sx={{ my: 1 }}>
                    <InputLabel id="mindset-select-label" sx={{ color: 'gray' }}>Mindset</InputLabel>
                    <Select
                        labelId="mindset-select-label"
                        value={editedGame.mindset}
                        label="Mindset"
                        onChange={(e) => setEditedGame({ ...editedGame, mindset: e.target.value })}
                        sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'gray' }, '& .MuiSvgIcon-root': { color: 'white' } }}
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
                    value={editedGame.reasonForEntry}
                    onChange={(e) => setEditedGame({ ...editedGame, reasonForEntry: e.target.value })}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ my: 1, textarea: { color: 'white' }, label: { color: 'gray' } }}
                />
                <TextField
                    label="Notes"
                    value={editedGame.notes}
                    onChange={(e) => setEditedGame({ ...editedGame, notes: e.target.value })}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ my: 1, textarea: { color: 'white' }, label: { color: 'gray' } }}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button onClick={onClose} sx={{ color: 'white' }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#9c27b0', ':hover': { bgcolor: '#7b1fa2' } }}>Save</Button>
                </Box>
            </Box>
        </Modal>
    );
};

const CrashGameHistory: React.FC<CrashGameHistoryProps> = ({ crashGames, onDeleteGame, onUpdateGame }) => {
  const [editingGame, setEditingGame] = useState<CrashGame | null>(null);

  const handleUpdate = (updatedGame: Partial<CrashGame>) => {
    if (editingGame) {
      onUpdateGame(editingGame.id!, updatedGame);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, bgcolor: '#2a2a2a', color: 'white' }}>
      <Typography variant="h5" gutterBottom>Crash Game History</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
        {crashGames.map((game) => (
          <Card key={game.id} variant="outlined" sx={{ bgcolor: '#3a3a3a', color: 'white' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{game.game}</Typography>
                    <Box>
                        <IconButton size="small" onClick={() => setEditingGame(game)}>
                            <EditIcon sx={{ color: 'white' }} />
                        </IconButton>
                        <IconButton size="small" onClick={() => onDeleteGame(game.id!)}>
                            <DeleteIcon sx={{ color: 'white' }} />
                        </IconButton>
                    </Box>
                </Box>
              <Typography variant="body2" color="text.secondary">
                {new Date(game.timestamp?.toDate()).toLocaleString()}
              </Typography>
              <Box sx={{ my: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <Typography variant="body2">Amount: ${game.amount}</Typography>
                  <Typography variant="body2">Cash-out Multiplier: {game.cashOutMultiplier}x</Typography>
                  <Typography variant="body2">Crash Point: {game.crashPoint}x</Typography>
                </div>
                <div>
                  <Chip 
                    label={game.outcome === 'win' ? 'Win' : 'Loss'} 
                    color={game.outcome === 'win' ? 'success' : 'error'} 
                    size="small" 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color={game.profit >= 0 ? 'success.main' : 'error.main'}>
                    Profit: ${game.profit.toFixed(2)}
                  </Typography>
                </div>
              </Box>
              {game.reasonForEntry && <Typography variant="body2">Reason: {game.reasonForEntry}</Typography>}
              {game.notes && <Typography variant="body2">Notes: {game.notes}</Typography>}
              {game.mindset && <Typography variant="body2">Mindset: {game.mindset}</Typography>}
            </CardContent>
          </Card>
        ))}
      </Box>
      <EditGameModal game={editingGame} onClose={() => setEditingGame(null)} onSave={handleUpdate} />
    </Paper>
  );
};

export default CrashGameHistory;
