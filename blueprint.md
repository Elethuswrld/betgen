# BetGen Dashboard Blueprint

## Overview

**“Gamble like a trader. Measure everything. Improve deliberately.”**

BetGen is a self-awareness and strategy enhancement tool for disciplined gamblers. It helps you:

- Track every bet like a trade 🧾
- Quantify your emotions, decisions, and outcomes 📈
- Identify your edge and eliminate impulsive habits 🧠
- Develop data-backed strategies instead of emotional betting 💪

**System Philosophy in One Line:** “BetGen = Trade Journal + Psychology Coach + Risk Manager for Gamblers.”

## Core System Components (Behavior-First Architecture)

### 1. Round Logger (Trade Journal)
Treat every bet like a trade entry:
- **🎮 Game Name**
- **💸 Bet Amount**
- **🎯 Target Multiplier**
- **🚀 Actual Cashout / “Flew Away” button**
- **🧠 Emotion Tag** (e.g., Calm, Excited, Fearful, Tilted)
- **📝 Reason for Entry** (Why did I take this?)

Then auto-calculate:
- **Profit/Loss**
- **Risk-to-Reward ratio**
- **Expected value**

### 2. Bankroll Tracker (Your Trading Account)
Displays:
- **Starting balance**
- **Current balance**
- **Total profit/loss**
- **Equity curve** (like a trader’s balance over time)
- **Daily performance summary**

Goal: Treat bankroll like capital management, not gambling funds.

### 3. Performance Dashboard (Your Analyst)
Analytics that give you feedback like a trading coach:
- **Win rate**
- **Average cashout multiplier**
- **Average risk/reward**
- **Longest losing streak**
- **Peak equity vs drawdown**
- **Emotional pattern** (e.g. “You lose more when emotional = Fearful”)

### 4. Mindset Zone (Your Trading Psychology Journal)
Space for:
- **Daily journal entry** (“How did I feel today?”)
- **Motivation notes**
- **Daily stop-loss + profit target**
- **Reflections on discipline**

## Implemented Features

### UI Glow-Up
- **Custom MUI Theme:** Dark, neon-accented theme for a high-tech feel.
- **Custom Fonts:** "Inter" and "Orbitron" for unique typography.
- **Glowing Buttons:** Interactive buttons with a glow effect.

### Landing & Navigation
- **Animated Landing Screen:** An engaging, animated entry point.
- **Routing:** `react-router-dom` for seamless navigation between pages.
- **Sidebar Navigation:** For easy access to all sections of the app.

### Dashboard (Live Data)
- **Real-time KPI Cards:** Current Balance, Profit/Loss, Win Rate, Best Streak.
- **Real-time Bankroll Chart:** Visualizes bankroll changes over time.
- **Round Logger:** Logs game data to Firestore, including game name, bet amount, target multiplier, actual cashout, emotion, and reason for entry. It also calculates Profit/Loss, Risk-to-Reward Ratio, and Expected Value.

### Performance Dashboard
- **Fetches Historical Data:** Connects to the "rounds" collection in Firestore.
- **Calculates Key Metrics:** Computes and displays Overall Win Rate, Average Win Amount, and Average Loss Amount.
- **Visualizes Performance:** Includes interactive bar charts to analyze performance by emotion and by game, showing win rates and total profit for each category.

### Mindset Zone
- **Pre-Session Warm-up:** A form to record mental state, session goals, and stop-loss before starting to play.
- **Post-Session Cool-down:** A form to reflect on the session's outcome, discipline, and key lessons learned.
- **Firestore Integration:** Saves all warm-up and cool-down data to a new "sessions" collection in Firestore.

### Settings
- **Bankroll Configuration:** Allows the user to set their starting bankroll.
- **Firestore Integration:** Saves the starting bankroll to a "settings" collection in Firestore, which is then used as the baseline for all profit/loss calculations.

## Next Evolution Steps

| Phase | Feature | Purpose |
| :--- | :--- | :--- |
| 5️⃣ | **Behavior Insights Engine** | AI-driven performance + psychology feedback |
| 6️⃣ | **Session Analytics** | Compare sessions by mindset & game |
| 7️⃣ | **Smart Reinvestment Tool**| Calculate safe next bet size using bankroll % |
| 8️⃣ | **Community Mode** | Private stat-sharing & challenges |
| 9️⃣ | **PWA / Mobile Mode** | Gamblers can log rounds anywhere |
