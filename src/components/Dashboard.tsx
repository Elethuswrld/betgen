
import React from 'react';

interface Bet {
  sport: string;
  game: string;
  betType: string;
  amount: number;
  odds: number;
  outcome: 'win' | 'loss';
  notes: string;
  profit: number;
}

interface DashboardProps {
  bets: Bet[];
}

const Dashboard: React.FC<DashboardProps> = ({ bets }) => {
  const totalBets = bets.length;
  const winningBets = bets.filter(bet => bet.outcome === 'win').length;
  const winRate = totalBets > 0 ? (winningBets / totalBets) * 100 : 0;
  const totalWagered = bets.reduce((acc, bet) => acc + bet.amount, 0);
  const totalProfit = bets.reduce((acc, bet) => acc + bet.profit, 0);

  const StatCard = ({ title, value, isCurrency = false, colorClass = 'text-white' }: { title: string, value: string | number, isCurrency?: boolean, colorClass?: string }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
      <h3 className="text-lg font-semibold text-gray-400 mb-2">{title}</h3>
      <p className={`text-4xl font-bold ${colorClass}`}>
        {isCurrency && typeof value === 'number' ? `$${value.toFixed(2)}` : value}
      </p>
    </div>
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Performance Dashboard</h2>
      <div className="grid grid-cols-1 gap-6">
        <StatCard 
          title="Total Profit/Loss" 
          value={totalProfit} 
          isCurrency 
          colorClass={totalProfit >= 0 ? 'text-green-400' : 'text-red-400'} 
        />
        <StatCard title="Win Rate" value={`${winRate.toFixed(1)}%`} />
        <StatCard title="Total Bets" value={totalBets} />
        <StatCard title="Total Wagered" value={totalWagered} isCurrency />
      </div>
    </div>
  );
};

export default Dashboard;
