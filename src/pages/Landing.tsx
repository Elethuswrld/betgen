
import { Button, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "primary.main",
            textShadow: "0 0 20px rgba(0, 230, 118, 0.8)",
          }}
        >
          BetGen Dashboard
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <Typography
          variant="subtitle1"
          sx={{ mt: 2, color: "text.secondary" }}
        >
          Track. Analyze. Evolve your betting discipline.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 4, px: 4, py: 1.5 }}
          onClick={() => navigate("/dashboard")}
        >
          Launch Dashboard
        </Button>
      </motion.div>
    </Box>
  );
}

export default Landing;
