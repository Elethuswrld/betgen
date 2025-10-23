
# BetGen Project Blueprint

## Overview

BetGen is a sophisticated tool for tracking, analyzing, and improving betting discipline for games like SkyCash and RedRocket. It is not a betting platform, but a tool to help users make smarter, more disciplined betting decisions.

## Implemented Features

### Phase 1: Core MVP & MUI Integration

*   **`RoundLogger.tsx`**: A form to log individual betting rounds with fields for game name, bet amount, target multiplier, and actual cashout multiplier. It calculates and displays profit/loss in real-time and includes a "Flew Away / Loss" button for quick loss logging.
*   **`BankrollTracker.tsx`**: A dashboard to display key bankroll metrics like starting balance, current balance, total profit/loss, and growth rate.
*   **`PerformanceDashboard.tsx`**: A visual summary of key performance indicators such as win rate, average cashout, best/worst streaks, and total games played.
*   **`MindsetZone.tsx`**: A "Discipline Board" to set daily profit targets and stop-loss limits, along with a section for motivational notes.
*   **Firebase Integration**: The application is connected to a Firestore database to persist and retrieve betting data in real-time.
*   **MUI Integration**: The project uses Material-UI for a consistent and modern design.
*   **Custom Theming**: A custom dark theme has been created to provide a unique and professional look and feel.

### Phase 2: Historical Data and Enhanced Navigation

*   **`History.tsx` Component**: A detailed, sortable, and paginated table view of all logged betting rounds, allowing users to review their complete betting history.
*   **Routing**: `react-router-dom` is implemented to create separate pages for the main dashboard and the historical data view.
*   **Navigation Bar**: The `AppBar` now includes navigation links to easily switch between the dashboard and history pages.
*   **`Dashboard.tsx` Component**: The main dashboard content has been encapsulated in its own component for better code organization.

### Phase 3: Data Visualization

*   **Charting Library**: The `recharts` library has been integrated to create interactive charts.
*   **`BankrollChart.tsx`**: A line chart that visualizes the user's bankroll over time, providing a clear view of financial progress.
*   **`ProfitLossChart.tsx`**: A bar chart that displays the profit or loss for each betting round, with color-coded bars for immediate visual feedback.
*   **Dashboard Integration**: The new charts have been added to the main dashboard, offering a comprehensive and visually rich overview of betting performance.

### Phase 4: User Authentication

*   **`Login.tsx`**: A dedicated login page with a "Sign in with Google" button.
*   **`Auth.tsx`**: An authentication wrapper that directs users to the login page if they are not signed in, and to the main application if they are.
*   **Firebase Authentication**: Integrated Firebase Authentication to provide a secure and easy-to-use login system.
*   **`react-firebase-hooks`**: Utilized this library to easily manage and listen to the user's authentication state.

## Current Plan

### Phase 5: Advanced Analytics & Data Security

*   **Data Security Rules**: Implement Firestore security rules to ensure that users can only access their own data.
*   **Advanced Filtering**: Add advanced filtering options to the `History` page, allowing users to filter by game, date range, and other criteria.
*   **Personalized Insights**: Develop a system to provide personalized insights and suggestions based on the user's betting patterns.
