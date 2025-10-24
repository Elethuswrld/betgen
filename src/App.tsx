
import { ThemeProvider } from "@mui/material/styles";
import Dashboard from "./components/dashboard/Dashboard";
import theme from "./theme";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dashboard />
    </ThemeProvider>
  );
}

export default App;
