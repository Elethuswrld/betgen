import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppBar, Toolbar, Typography, Box, Avatar, Switch } from "@mui/material";
import { useTheme } from "../../theme/ThemeProvider";
const TopBar = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    return (_jsx(AppBar, { position: "static", color: "transparent", elevation: 0, sx: {
            borderBottom: "1px solid #222",
            backdropFilter: "blur(10px)",
        }, children: _jsxs(Toolbar, { sx: { display: "flex", justifyContent: "space-between" }, children: [_jsx(Typography, { variant: "h6", color: "primary", children: "Dashboard" }), _jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 2 }, children: [_jsx(Typography, { variant: "body1", color: "text.secondary", children: "Balance: R12,450" }), _jsx(Switch, { checked: isDarkMode, onChange: toggleTheme }), _jsx(Avatar, { alt: "User", src: "", sx: { bgcolor: "primary.main" } })] })] }) }));
};
export default TopBar;
