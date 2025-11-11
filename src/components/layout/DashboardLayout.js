import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
const DashboardLayout = ({ children }) => {
    return (_jsxs(Box, { sx: { display: "flex" }, children: [_jsx(Sidebar, {}), _jsxs(Box, { sx: { flexGrow: 1, display: "flex", flexDirection: "column" }, children: [_jsx(TopBar, {}), _jsx(Box, { sx: { p: 3 }, children: children })] })] }));
};
export default DashboardLayout;
