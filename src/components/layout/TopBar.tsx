
import { AppBar, Toolbar, Typography, Box, Avatar, Switch } from "@mui/material";
import { useTheme } from "../../theme/ThemeProvider";

const TopBar = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: "1px solid #222",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" color="primary">
          Dashboard
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Balance: R12,450
          </Typography>
          <Switch checked={isDarkMode} onChange={toggleTheme} />
          <Avatar alt="User" src="" sx={{ bgcolor: "primary.main" }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
