import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Grid } from "@mui/material";
import BankrollChart from "../components/dashboard/BankrollChart";
import KpiCards from "../components/dashboard/KpiCards";
import RoundLogger from "../components/dashboard/RoundLogger";
import BehavioralInsights from "../components/dashboard/BehavioralInsights";
import Recommendations from "../components/dashboard/Recommendations";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import RecentBetsTable from "../components/dashboard/RecentBetsTable";
const Dashboard = () => {
    return (_jsx(Box, { sx: { p: 3 }, children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(KpiCards, {}) }), _jsx(Grid, { item: true, md: 6, xs: 12, children: _jsx(BehavioralInsights, {}) }), _jsx(Grid, { item: true, md: 6, xs: 12, children: _jsx(Recommendations, {}) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(BankrollChart, {}) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(PerformanceChart, {}) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(RecentBetsTable, {}) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(RoundLogger, {}) })] }) }));
};
export default Dashboard;
