
export const mockBets = [
  { id: '1', game: 'Lakers vs. Warriors', outcome: 'Lakers Win', amount: 100, odds: 1.5, date: '2024-05-20', status: 'Won', profit: 50 },
  { id: '2', game: 'Chiefs vs. Eagles', outcome: 'Chiefs Win', amount: 50, odds: 2.0, date: '2024-05-22', status: 'Lost', profit: -50 },
  { id: '3', game: 'Yankees vs. Red Sox', outcome: 'Yankees Win', amount: 75, odds: 1.8, date: '2024-05-25', status: 'Pending', profit: 0 },
  { id: '4', game: 'Nets vs. Celtics', outcome: 'Nets Win', amount: 120, odds: 2.2, date: '2024-05-28', status: 'Won', profit: 144 },
  { id: '5', game: 'Rangers vs. Islanders', outcome: 'Islanders Win', amount: 200, odds: 1.3, date: '2024-06-01', status: 'Lost', profit: -200 },
];

export const mockLeaderboard = [
  { rank: 1, name: 'Alice', weeklyWinnings: 1500, overallWinnings: 5000, profileImage: '/path/to/alice.png' },
  { rank: 2, name: 'Bob', weeklyWinnings: 1200, overallWinnings: 4500, profileImage: '/path/to/bob.png' },
  { rank: 3, name: 'Charlie', weeklyWinnings: 1000, overallWinnings: 4000, profileImage: '/path/to/charlie.png' },
  { rank: 4, name: 'David', weeklyWinnings: 800, overallWinnings: 3500, profileImage: '/path/to/david.png' },
  { rank: 5, name: 'Eve', weeklyWinnings: 600, overallWinnings: 3000, profileImage: '/path/to/eve.png' },
];

export const mockAccount = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  profileImage: '/path/to/john.png',
  bettingHistory: mockBets,
  accountBalance: 2500,
};

export const mockPerformance = [
  { date: '2024-05-01', winnings: 200 },
  { date: '2024-05-02', winnings: -100 },
  { date: '2024-05-03', winnings: 150 },
  { date: '2024-05-04', winnings: 300 },
  { date: '2024-05-05', winnings: -50 },
  { date: '2024-05-06', winnings: 250 },
  { date: '2024-05-07', winnings: -120 },
];

export const mockSummary = {
  totalProfit: -56,
  winRate: 40,
  totalBets: 5,
};
