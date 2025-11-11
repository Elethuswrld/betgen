import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Dashboard = ({ bets }) => {
    const totalBets = bets.length;
    const winningBets = bets.filter(bet => bet.outcome === 'win').length;
    const winRate = totalBets > 0 ? (winningBets / totalBets) * 100 : 0;
    const totalWagered = bets.reduce((acc, bet) => acc + bet.amount, 0);
    const totalProfit = bets.reduce((acc, bet) => acc + bet.profit, 0);
    const StatCard = ({ title, value, isCurrency = false, colorClass = 'text-white' }) => (_jsxs("div", { className: "bg-gray-800 p-6 rounded-lg shadow-lg text-center", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-400 mb-2", children: title }), _jsx("p", { className: `text-4xl font-bold ${colorClass}`, children: isCurrency ? `$${value.toFixed(2)}` : value })] }));
    return (_jsxs("div", { className: "bg-gray-800 p-6 rounded-lg shadow-lg", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-white", children: "Performance Dashboard" }), _jsxs("div", { className: "grid grid-cols-1 gap-6", children: [_jsx(StatCard, { title: "Total Profit/Loss", value: totalProfit, isCurrency: true, colorClass: totalProfit >= 0 ? 'text-green-400' : 'text-red-400' }), _jsx(StatCard, { title: "Win Rate", value: `${winRate.toFixed(1)}%` }), _jsx(StatCard, { title: "Total Bets", value: totalBets }), _jsx(StatCard, { title: "Total Wagered", value: totalWagered, isCurrency: true })] })] }));
};
export default Dashboard;
