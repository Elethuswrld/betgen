
import { collection, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

// --- TYPE DEFINITIONS ---

interface Round {
    id: string;
    amount: number;
    cashOutMultiplier: number;
    crashPoint: number;
    profit: number;
    outcome: 'win' | 'loss';
    timestamp: Timestamp;
}

interface MindsetEntry {
    id: string;
    emotionalBiasScore: number; // Assuming this is now a number from 0-100
    timestamp: Timestamp;
}

interface AnalyticsResult {
    winRate: number;
    avgMultiplier: number;
    riskRewardRatio: number;
    profitConsistencyScore: number;
    lossStreaks: number;
    emotionalBiasScore: number;
    bestRange: string;
    performanceSummary: string;
    aiSuggestion: string;
    lastAnalyzed: Timestamp;
    aiComment: string;
}

// --- CORE ANALYSIS FUNCTIONS ---

/**
 * Calculates the win rate from a series of rounds.
 * @param rounds - Array of round objects.
 * @returns The win rate as a percentage.
 */
const calculateWinRate = (rounds: Round[]): number => {
    if (rounds.length === 0) return 0;
    const wins = rounds.filter(r => r.outcome === 'win').length;
    return (wins / rounds.length) * 100;
};

/**
 * Calculates the average multiplier for winning rounds.
 * @param rounds - Array of round objects.
 * @returns The average cash-out multiplier for wins.
 */
const calculateAvgMultiplier = (rounds: Round[]): number => {
    const winningRounds = rounds.filter(r => r.outcome === 'win');
    if (winningRounds.length === 0) return 0;
    const totalMultiplier = winningRounds.reduce((sum, r) => sum + r.cashOutMultiplier, 0);
    return totalMultiplier / winningRounds.length;
};

/**
 * Calculates the ratio of the average win amount to the average loss amount.
 * @param rounds - Array of round objects.
 * @returns The risk/reward ratio.
 */
const calculateRiskReward = (rounds: Round[]): number => {
    const wins = rounds.filter(r => r.outcome === 'win');
    const losses = rounds.filter(r => r.outcome === 'loss');
    if (losses.length === 0) return wins.length > 0 ? 100 : 0; // Infinite reward if no losses
    if (wins.length === 0) return 0;

    const avgWin = wins.reduce((sum, r) => sum + r.profit, 0) / wins.length;
    const avgLoss = Math.abs(losses.reduce((sum, r) => sum + r.profit, 0) / losses.length);
    
    return avgWin / avgLoss;
}

/**
 * Detects patterns of "revenge betting" - significantly increasing bet size after a loss.
 * @param rounds - Chronologically sorted array of round objects.
 * @returns A score from 0 to 100 indicating the likelihood of revenge betting.
 */
const detectRevengeBetting = (rounds: Round[]): number => {
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
 * @param rounds - Array of round objects.
 * @param mindsetEntries - Array of mindset entries.
 * @returns An aggregated emotional bias score impacting performance.
 */
const analyzeEmotionalCorrelation = (rounds: Round[], mindsetEntries: MindsetEntry[]): number => {
    if (mindsetEntries.length === 0) return 50; // Neutral score if no data
    const latestMindset = mindsetEntries[0]; // Assuming entries are sorted desc
    return latestMindset.emotionalBiasScore;
}

/**
 * Analyzes the profitability of different multiplier ranges.
 * @param rounds - Array of round objects.
 * @returns The most profitable multiplier range as a string (e.g., "1.5x-2.0x").
 */
const findBestRange = (rounds: Round[]): string => {
    const ranges = { "1.1-1.5x": 0, "1.5-2.0x": 0, "2.0-3.0x": 0, "3.0x+": 0 };
    rounds.filter(r => r.outcome === 'win').forEach(r => {
        if (r.cashOutMultiplier <= 1.5) ranges["1.1-1.5x"] += r.profit;
        else if (r.cashOutMultiplier <= 2.0) ranges["1.5-2.0x"] += r.profit;
        else if (r.cashOutMultiplier <= 3.0) ranges["2.0-3.0x"] += r.profit;
        else ranges["3.0x+"] += r.profit;
    });
    return Object.keys(ranges).reduce((a, b) => ranges[a] > ranges[b] ? a : b);
}

/**
 * Generates a concise AI comment based on the primary detected pattern.
 * @param analytics - The calculated analytics object.
 * @returns A short, actionable comment.
 */
const generateAiComment = (analytics: Omit<AnalyticsResult, 'aiComment' | 'lastAnalyzed'>): string => {
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
}

// --- MAIN EXPORTED FUNCTION ---

/**
 * The main function to analyze a user's performance data.
 * It fetches all necessary data, runs calculations, and stores the result.
 * @param userId - The ID of the user to analyze.
 */
export const analyzeUserPerformance = async (userId: string): Promise<void> => {
    try {
        // 1. Fetch Data
        const roundsRef = collection(db, `users/${userId}/rounds`);
        const mindsetRef = collection(db, `users/${userId}/mindset`);

        const [roundsSnapshot, mindsetSnapshot] = await Promise.all([
            getDocs(roundsRef),
            getDocs(mindsetRef),
        ]);

        const rounds = roundsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Round))
            .sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis()); // Sort chronological

        const mindsetEntries = mindsetSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as MindsetEntry))
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

        // Combine scores into a performance summary
        const performanceSummary = `You show consistency in the ${bestRange} range, but a ${revengeBettingScore}% revenge betting score and a ${emotionalBiasScore}% emotional bias suggest decisions are sometimes emotionally driven.`;
        
        const aiSuggestion = revengeBettingScore > 50 ? "Take a 5-minute break after every 2 consecutive losses to reset." : "Your strategy is solid. Focus on maintaining discipline during drawdowns.";
        
        const analyticsData: Omit<AnalyticsResult, 'aiComment' | 'lastAnalyzed'> = {
            winRate,
            avgMultiplier,
            riskRewardRatio,
            bestRange,
            profitConsistencyScore: 75, // Placeholder
            lossStreaks: 3, // Placeholder
            emotionalBiasScore,
            performanceSummary,
            aiSuggestion,
        };
        
        const aiComment = generateAiComment(analyticsData);

        const finalResult: AnalyticsResult = {
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
