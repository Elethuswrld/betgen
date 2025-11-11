import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(motion.div, { initial: { x: -200 }, animate: { x: 0 }, transition: { duration: 0.5 }, children: _jsxs(Box, { sx: {
                width: 220,
                height: "100vh",
                bgcolor: "background.paper",
                borderRight: "1px solid #222",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }, children: [_jsx(Typography, { variant: "h6", sx: {
                        color: "primary.main",
                        fontWeight: 700,
                        textAlign: "center",
                        mb: 2,
                    }, children: "\u26A1 BetGen" }), _jsx(List, { children: items.map((item) => (_jsx(ListItemButton, { onClick: () => navigate(item.path), selected: location.pathname === item.path, sx: {
                            borderRadius: 2,
                            mb: 1,
                            "&.Mui-selected": {
                                bgcolor: "primary.main",
                                color: "#000",
                                "&:hover": { bgcolor: "primary.main" },
                            },
                        }, children: _jsx(ListItemText, { primary: item.label }) }, item.label))) })] }) }));
};
export default Sidebar;
