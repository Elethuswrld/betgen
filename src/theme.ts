
import { createTheme } from '@mui/material/styles';
import { deepPurple, green } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: green[600],
    },
    secondary: {
      main: deepPurple[500],
    },
    background: {
      default: '#1a202c', // A deep blue-gray
      paper: '#2d3748', // A slightly lighter blue-gray for cards
    },
    text: {
      primary: '#e2e8f0', // Light gray for primary text
      secondary: '#a0aec0', // A softer gray for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    h2: {
      fontSize: '2.125rem',
      fontWeight: 700,
    },
    h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none', // Keep button text case as is
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
            }
        }
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 8,
                }
            }
        }
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }
        }
    }
  }
});

export default theme;
