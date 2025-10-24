
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Settings = () => {
  const [startingBankroll, setStartingBankroll] = useState<number>(0);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "settings", "user_settings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStartingBankroll(docSnap.data().startingBankroll);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const docRef = doc(db, "settings", "user_settings");
      await setDoc(docRef, { startingBankroll });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings: ", error);
      alert("Error saving settings.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="700" color="primary.main" gutterBottom>
        Settings ⚙️
      </Typography>
      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid #333",
          mt: 4,
          maxWidth: 400,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Bankroll Configuration
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Starting Bankroll (R)"
          type="number"
          value={startingBankroll}
          onChange={(e) => setStartingBankroll(Number(e.target.value))}
          sx={{ my: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ bgcolor: "primary.main", color: "#000", "&:hover": { bgcolor: "primary.dark" } }}
        >
          Save
        </Button>
      </Paper>
    </Box>
  );
};

export default Settings;
