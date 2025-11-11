import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
const Settings = () => {
    const { user } = useAuth();
    const [startingBankroll, setStartingBankroll] = useState(0);
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
            }
            catch (error) {
                console.error("Error saving settings: ", error);
                alert("Error saving settings.");
            }
        }
    };
    return (_jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", children: "Settings" }), _jsx(Box, { sx: { mt: 2 }, children: _jsx(TextField, { label: "Starting Bankroll", type: "number", value: startingBankroll, onChange: (e) => setStartingBankroll(Number(e.target.value)) }) }), _jsx(Button, { sx: { mt: 2 }, variant: "contained", onClick: handleSave, children: "Save" })] }));
};
export default Settings;
