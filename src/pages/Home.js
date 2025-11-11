import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import KpiCards from "../components/dashboard/KpiCards";
import BankrollChart from "../components/dashboard/BankrollChart";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import RecentBetsTable from "../components/dashboard/RecentBetsTable";
import MotivationalBanner from "../components/dashboard/MotivationalBanner";
import RoundLogger from "../components/dashboard/RoundLogger";
import BalanceManager from "../components/dashboard/BalanceManager";
const Home = () => {
    const [userId, setUserId] = useState(null);
    useEffect(() => {
        // In a real application, you would fetch the logged-in user's ID
        // For now, we'll use a placeholder
        setUserId("placeholderUserId");
    }, []);
    if (!userId) {
        return _jsx(Typography, { children: "Loading..." });
    }
    return (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(MotivationalBanner, {}) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(KpiCards, { userId: userId }) }), _jsx(Grid, { item: true, xs: 12, md: 8, children: _jsx(BankrollChart, { userId: userId }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(RoundLogger, { userId: userId }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(PerformanceChart, { userId: userId }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(BalanceManager, { userId: userId }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(RecentBetsTable, { userId: userId }) })] }));
};
export default Home;
