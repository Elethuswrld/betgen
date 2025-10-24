
import { Box, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const items = [
    { label: "Dashboard", path: "/" },
    { label: "Performance", path: "/performance" },
    { label: "Mindset Zone", path: "/mindset" },
    { label: "Settings", path: "/settings" },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          width: 220,
          height: "100vh",
          bgcolor: "background.paper",
          borderRight: "1px solid #222",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            fontWeight: 700,
            textAlign: "center",
            mb: 2,
          }}
        >
          ⚡ BetGen
        </Typography>

        <List>
          {items.map((item) => (
            <ListItemButton
              key={item.label}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                mb: 1,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "#000",
                  "&:hover": { bgcolor: "primary.main" },
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </motion.div>
  );
};

export default Sidebar;
