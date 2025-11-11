
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

const Settings = () => {
  const { user } = useAuth();
  const [startingBankroll, setStartingBankroll] = useState<number>(0);

  useEffect(() => {
    const fetchSettings = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStartingBankroll(docSnap.data().startingBankroll || 0);
        }
      }
    };
    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          await setDoc(docRef, { startingBankroll }, { merge: true });
          alert("Settings saved successfully!");
        } catch (error) {
          console.error("Error saving settings: ", error);
          alert("Error saving settings.");
        }
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Settings</Typography>
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Starting Bankroll"
          type="number"
          value={startingBankroll}
          onChange={(e) => setStartingBankroll(Number(e.target.value))}
        />
      </Box>
      <Button sx={{ mt: 2 }} variant="contained" onClick={handleSave}>
        Save
      </Button>
    </Paper>
  );
};

export default Settings;
