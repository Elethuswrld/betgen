
# BetGen - AI-Powered Crash Game Journal

## 1. Overview

BetGen is a sophisticated, AI-driven web application designed to help users track, analyze, and improve their performance in online crash games. By leveraging real-time data analysis, behavioral pattern detection, and personalized AI coaching, BetGen provides users with the tools they need to make smarter decisions, manage their bankroll effectively, and cultivate a winning mindset.

### Key Features:
- **Real-time Game Logging:** Instantly log crash game results, including bet amount, cash-out multiplier, and crash point.
- **Performance Dashboard:** Visualize your performance with key metrics like win rate, profit/loss, and streaks.
- **AI-Powered Analysis:** An advanced AI strategy engine analyzes your data to provide personalized insights and identify behavioral patterns.
- **Emotional Intelligence:** The AI can detect emotional trading and provide targeted advice to help you stay disciplined.
- **Mindset Journal:** Track your emotional and mental state before and after each session to identify patterns and make adjustments.
- **Serverless Cloud Functions:** Background analysis is offloaded to the cloud, ensuring the app remains fast and responsive.
- **Modern, Responsive UI:** A sleek, intuitive interface built with React and Material-UI, designed for both desktop and mobile devices.

## 2. Project Documentation

### Technologies Used:
- **Frontend:** React, TypeScript, Material-UI
- **Backend:** Firebase (Firestore, Authentication, Cloud Functions)
- **Styling:** Tailwind CSS, CSS-in-JS
- **Deployment:** Firebase Hosting

### Project Structure:
- `src/components`: Reusable React components.
- `src/pages`: Top-level page components for each route.
- `src/services`: AI strategy engine and other services.
- `src/firebase`: Firebase configuration and initialization.
- `functions`: Serverless Cloud Functions for background analysis.

### Core Components:
- `App.tsx`: The main application component, responsible for routing and state management.
- `CrashGameLogger.tsx`: A form for logging new crash game results.
- `CrashGameHistory.tsx`: A table displaying the user's game history.
- `PerformanceDashboard.tsx`: A dashboard with key performance metrics.
- `AiStrategyPanel.tsx`: A visually rich component that provides a high-level overview of the AI's analysis.
- `MindsetZone.tsx`: A form for logging mindset journal entries.
- `MindsetHistoryPage.tsx`: A page displaying the user's mindset journal history.
- `UserProfilePage.tsx`: A page for managing the user's profile.
- `SideNav.tsx`: A consistent navigation experience across all pages.

## 3. Current Task: Finalizing the Application

In this final phase of development, I have focused on polishing the user experience and adding a few key features to complete the application.

### Key Improvements:
- **AI Strategy Panel:** I have created a new, visually rich `AiStrategyPanel.tsx` component to provide a high-level overview of the AI's analysis. This component is now prominently displayed on the main dashboard.
- **Serverless Cloud Functions:** I have created a new Cloud Function in `functions/src/aiAnalysis.ts` that automatically analyzes performance data in the background. This ensures the app remains fast and responsive while the AI is always working to provide the most up-to-date insights.
- **Emotional Intelligence:** I have integrated Emotional Intelligence into the AI by adding a new `emotionalBiasScore` field to the `MindsetZone` component. The AI can now detect when the user is trading emotionally and provide warnings and suggestions to help them refocus.
- **User Profile Page:** I have created a new `UserProfilePage.tsx` that displays the user's starting balance, current balance, total profit/loss, a new "Risk Profile" setting, and a new "Goals" section. I have also updated the page with a new, more modern design.
- **Mindset History Page:** I have created a new `MindsetHistoryPage.tsx` that will provide a complete history of the user's mindset journal entries. This will allow the user to track their emotional and mental state over time, identify patterns, and make adjustments to their trading strategy.
- **Side Navigation:** I have created a new `SideNav.tsx` that provides a consistent navigation experience across all pages. This makes it easier for the user to switch between the dashboard, mindset history, and profile pages.
