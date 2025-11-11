import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const MindsetChart = ({ crashGames }) => {
    const processData = () => {
        const mindsets = ['Neutral', 'Focused', 'Greedy', 'Tilted', 'Disciplined'];
        const data = mindsets.map(mindset => ({
            name: mindset,
            profit: 0,
        }));
        crashGames.forEach(game => {
            const index = data.findIndex(d => d.name === game.mindset);
            if (index !== -1) {
                data[index].profit += game.profit;
            }
        });
        return data;
    };
    const data = processData();
    return (_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: data, margin: {
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#444" }), _jsx(XAxis, { dataKey: "name", stroke: "#fff" }), _jsx(YAxis, { stroke: "#fff" }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#333', border: 'none' } }), _jsx(Legend, { wrapperStyle: { color: '#fff' } }), _jsx(Bar, { dataKey: "profit", fill: "#9c27b0" })] }) }));
};
export default MindsetChart;
