
import { collection, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

// --- CORE ANALYSIS FUNCTIONS ---

/**
 * Calculates the win rate from a series of rounds.
 * @param {Array<object>} rounds - Array of round objects.
 * @returns {number} The win rate as a percentage.
 */
const calculateWinRate = (rounds) => {
    if (rounds.length === 0) return 0;
    const wins = rounds.filter(r => r.outcome === 'win').length;
    return (wins / rounds.length) * 100;
};

/**
 * Calculates the average multiplier for winning rounds.
 * @param {Array<object>} rounds - Array of round objects.
 * @returns {number} The average cash-out multiplier for wins.
 */
const calculateAvgMultiplier = (rounds) => {
    const winningRounds = rounds.filter(r => r.outcome === 'win');
    if (winningRounds.length === 0) return 0;
    const totalMultiplier = winningRounds.reduce((sum, r) => sum + r.cashOutMultiplier, 0);
    return totalMultiplier / winningRounds.length;
};

/**
 * Calculates the ratio of the average win amount to the average loss amount.
 * @param {Array<object>} rounds - Array of round objects.
 * @returns {number} The risk/reward ratio.
 */
const calculateRiskReward = (rounds) => {
    const wins = rounds.filter(r => r.outcome === 'win');
    const losses = rounds.filter(r => r.outcome === 'loss');
    if (losses.length === 0) return wins.length > 0 ? 100 : 0; // Infinite reward if no losses
    if (wins.length === 0) return 0;
    const avgWin = wins.reduce((sum, r) => sum + r.profit, 0) / wins.length;
    const avgLoss = Math.abs(losses.reduce((sum, r) => sum + r.profit, 0) / losses.length);
    return avgWin / avgLoss;
};

/**
 * Calculates the consistency of profits using the standard deviation relative to the average bet size.
 * A lower score means more volatile profits, a higher score means more consistent profits.
 * @param {Array<object>} rounds - Array of round objects.
 * @returns {number} A consistency score from 0 to 100.
 */
const calculateProfitConsistency = (rounds) => {
    if (rounds.length < 2) return 50; // Neutral score for insufficient data
    const profits = rounds.map(r => r.profit);
    const meanProfit = profits.reduce((sum, p) => sum + p, 0) / profits.length;
    const variance = profits.reduce((sum, p) => sum + Math.pow(p - meanProfit, 2), 0) / profits.length;
    const stdDev = Math.sqrt(variance);

    const avgBet = rounds.reduce((sum, r) => sum + r.amount, 0) / rounds.length;
    if (avgBet === 0) return 50;

    // Normalize the score. A lower std dev relative to bet size is better.
    const relativeStdDev = stdDev / avgBet;
    const score = 100 - (relativeStdDev * 50); // Scale the score

    return Math.max(0, Math.min(100, score)); // Clamp between 0 and 100
};

/**
 * Calculates the longest streak of consecutive losses.
 * @param {Array<object>} rounds - Chronologically sorted array of round objects.
 * @returns {number} The maximum number of consecutive losses.
 */
const calculateMaxLossStreak = (rounds) => {
    let maxStreak = 0;
    let currentStreak = 0;
    for (const round of rounds) {
        if (round.outcome === 'loss') {
            currentStreak++;
        } else {
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }
            currentStreak = 0;
        }
    }
    // Final check in case the streak is at the very end
    if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
    }
    return maxStreak;
};

/**
 * Detects patterns of "revenge betting" - significantly increasing bet size after a loss.
 * @param {Array<object>} rounds - Chronologically sorted array of round objects.
 * @returns {number} A score from 0 to 100 indicating the likelihood of revenge betting.
 */
const detectRevengeBetting = (rounds) => {
    let revengeScore = 0;
    for (let i = 1; i < rounds.length; i++) {
        if (rounds[i - 1].outcome === 'loss' && rounds[i].amount > rounds[i - 1].amount * 1.5) {
            revengeScore += 20; // Add points for each detected instance
        }
    }
    return Math.min(revengeScore, 100);
};

/**
 * Correlates emotional bias scores from mindset entries with trading performance.
 * @param {Array<object>} rounds - Array of round objects.
 * @param {Array<object>} mindsetEntries - Array of mindset entries.
 * @returns {number} An aggregated emotional bias score impacting performance.
 */
const analyzeEmotionalCorrelation = (rounds, mindsetEntries) => {
    if (mindsetEntries.length === 0) return 50; // Neutral score if no data
    const latestMindset = mindsetEntries[0]; // Assuming entries are sorted desc
    return latestMindset.emotionalBiasScore;
};

/**
 * Analyzes the profitability of different multiplier ranges.
 * @param {Array<object>} rounds - Array of round objects.
 * @returns {string} The most profitable multiplier range as a string (e.g., "1.5x-2.0x").
 */
const findBestRange = (rounds) => {
    const ranges = { "1.1-1.5x": 0, "1.5-2.0x": 0, "2.0-3.0x": 0, "3.0x+": 0 };
    rounds.filter(r => r.outcome === 'win').forEach(r => {
        if (r.cashOutMultiplier <= 1.5) ranges["1.1-1.5x"] += r.profit;
        else if (r.cashOutMultiplier <= 2.0) ranges["1.5-2.0x"] += r.profit;
        else if (r.cashOutMultiplier <= 3.0) ranges["2.0-3.0x"] += r.profit;
        else ranges["3.0x+"] += r.profit;
    });
    return Object.keys(ranges).reduce((a, b) => ranges[a] > ranges[b] ? a : b);
};

/**
 * Generates a concise AI comment based on the primary detected pattern.
 * @param {object} analytics - The calculated analytics object.
 * @returns {string} A short, actionable comment.
 */
const generateAiComment = (analytics) => {
    if (analytics.lossStreaks > 5) {
        return `A loss streak of ${analytics.lossStreaks} is high. Review your risk management and consider a break.`;
    }
    if (analytics.emotionalBiasScore > 75) {
        return "High emotional bias detected. Focus on detaching from outcomes.";
    }
    if (analytics.winRate < 40) {
        return "Win rate is low. Consider lowering your risk or reviewing your entry points.";
    }
    if (analytics.riskRewardRatio < 1) {
        return "Your risk/reward is unfavorable. Aim for larger wins or smaller losses.";
    }
    return "Performance is stable. Continue executing your strategy with discipline.";
};

// --- MAIN EXPORTED FUNCTION ---

/**
 * The main function to analyze a user's performance data.
 * It fetches all necessary data, runs calculations, and stores the result.
 * @param {string} userId - The ID of the user to analyze.
 */
export const analyzeUserPerformance = async (userId) => {
    try {
        // 1. Fetch Data
        const roundsRef = collection(db, `users/${userId}/rounds`);
        const mindsetRef = collection(db, `users/${userId}/mindset`);

        const [roundsSnapshot, mindsetSnapshot] = await Promise.all([
            getDocs(roundsRef),
            getDocs(mindsetRef),
        ]);

        const rounds = roundsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis()); // Sort chronological

        const mindsetEntries = mindsetSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()); // Sort reverse-chronological

        if (rounds.length < 5) {
            console.log("Not enough data to analyze.");
            return;
        }

        // 2. Calculate Metrics
        const winRate = calculateWinRate(rounds);
        const avgMultiplier = calculateAvgMultiplier(rounds);
        const riskRewardRatio = calculateRiskReward(rounds);
        const bestRange = findBestRange(rounds);
        const revengeBettingScore = detectRevengeBetting(rounds);
        const emotionalBiasScore = analyzeEmotionalCorrelation(rounds, mindsetEntries);
        const profitConsistencyScore = calculateProfitConsistency(rounds);
        const lossStreaks = calculateMaxLossStreak(rounds);

        // Combine scores into a performance summary
        const performanceSummary = `You show consistency in the ${bestRange} range, but a ${revengeBettingScore}% revenge betting score and a ${emotionalBiasScore}% emotional bias suggest decisions are sometimes emotionally driven.`;
        const aiSuggestion = revengeBettingScore > 50 ? "Take a 5-minute break after every 2 consecutive losses to reset." : "Your strategy is solid. Focus on maintaining discipline during drawdowns.";

        const analyticsData = {
            winRate,
            avgMultiplier,
            riskRewardRatio,
            bestRange,
            profitConsistencyScore,
            lossStreaks,
            emotionalBiasScore,
            performanceSummary,
            aiSuggestion,
        };

        const aiComment = generateAiComment(analyticsData);

        const finalResult = {
            ...analyticsData,
            aiComment,
            lastAnalyzed: Timestamp.now(),
        };

        // 3. Store Result
        const analyticsDocRef = doc(db, `users/${userId}/analytics`, 'latest');
        await setDoc(analyticsDocRef, finalResult);

        console.log(`Successfully analyzed performance for user ${userId}`);

    } catch (error) {
        console.error("Error in AI Strategy Engine: ", error);
    }
};

export default analyzeUserPerformance;
