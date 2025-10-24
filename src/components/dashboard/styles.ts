
import { SxProps, Theme } from '@mui/material/styles';

export const statCardStyle: SxProps<Theme> = {
  p: 2,
  textAlign: 'center',
  borderRadius: 3,
  border: '1px solid #30363d',
  backgroundColor: '#161b22',
};

export const chartPaperStyle: SxProps<Theme> = {
  p: 2,
  borderRadius: 3,
  border: '1px solid #30363d',
  height: 350,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#161b22',
};

export const neonGradientButtonStyle: SxProps<Theme> = {
  background: 'linear-gradient(45deg, #00ff99 30%, #00ccff 90%)',
  color: '#0d1117',
  fontWeight: 'bold',
  boxShadow: '0 0 15px rgba(0, 255, 153, 0.5)',
  '&:hover': {
    boxShadow: '0 0 25px rgba(0, 255, 153, 0.8)',
  },
};
