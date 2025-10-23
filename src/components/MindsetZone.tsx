
import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Grid, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';

const MindsetZone = () => {
  const [profitTarget, setProfitTarget] = useState(100);
  const [stopLoss, setStopLoss] = useState(50);
  const [notes, setNotes] = useState('Stay disciplined and stick to the plan.');

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Mindset Zone
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StarIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                Daily Profit Target
              </Typography>
              <TextField
                type="number"
                value={profitTarget}
                onChange={(e) => setProfitTarget(parseFloat(e.target.value))}
                size="small"
                sx={{ width: '100px' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BlockIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                Stop-Loss Limit
              </Typography>
              <TextField
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(parseFloat(e.target.value))}
                size="small"
                sx={{ width: '100px' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <EditIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                Discipline Notes
              </Typography>
            </Box>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MindsetZone;
