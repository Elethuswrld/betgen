"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeUserPerformance = void 0;
const admin = require("firebase-admin");
const firestore_1 = require("firebase-admin/firestore");
const db = admin.firestore();
// --- CORE ANALYSIS FUNCTIONS (Copied from shared/aiStrategyEngine.ts) ---
const calculateWinRate = (rounds) => {
    if (rounds.length === 0)
        return 0;
    const wins = rounds.filter(r => r.outcome === 'win').length;
    return (wins / rounds.length) * 100;
};
const calculateAvgMultiplier = (rounds) => {
    const winningRounds = rounds.filter(r => r.outcome === 'win');
    if (winningRounds.length === 0)
        return 0;
    const totalMultiplier = winningRounds.reduce((sum, r) => sum + r.cashOutMultiplier, 0);
    return totalMultiplier / winningRounds.length;
};
const calculateRiskReward = (rounds) => {
    const wins = rounds.filter(r => r.outcome === 'win');
    const losses = rounds.filter(r => r.outcome === 'loss');
    if (losses.length === 0)
        return wins.length > 0 ? 100 : 0;
    if (wins.length === 0)
        return 0;
    const avgWin = wins.reduce((sum, r) => sum + r.profit, 0) / wins.length;
    const avgLoss = Math.abs(losses.reduce((sum, r) => sum + r.profit, 0) / losses.length);
    return avgWin / avgLoss;
};
const detectRevengeBetting = (rounds) => {
    let revengeScore = 0;
    for (let i = 1; i < rounds.length; i++) {
        if (rounds[i - 1].outcome === 'loss' && rounds[i].amount > rounds[i - 1].amount * 1.5) {
            revengeScore += 20;
        }
    }
    return Math.min(revengeScore, 100);
};
const analyzeEmotionalCorrelation = (rounds, mindsetEntries) => {
    if (mindsetEntries.length === 0)
        return 50;
    const latestMindset = mindsetEntries[0];
    return latestMindset.emotionalBiasScore;
};
const findBestRange = (rounds) => {
    const ranges = { "1.1-1.5x": 0, "1.5-2.0x": 0, "2.0-3.0x": 0, "3.0x+": 0 };
    rounds.filter(r => r.outcome === 'win').forEach(r => {
        if (r.cashOutMultiplier <= 1.5)
            ranges["1.1-1.5x"] += r.profit;
        else if (r.cashOutMultiplier <= 2.0)
            ranges["1.5-2.0x"] += r.profit;
        else if (r.cashOutMultiplier <= 3.0)
            ranges["2.0-3.0x"] += r.profit;
        else
            ranges["3.0x+"] += r.profit;
    });
    return Object.keys(ranges).reduce((a, b) => ranges[a] > ranges[b] ? a : b);
};
const generateAiComment = (analytics) => {
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
const analyzeUserPerformance = async (userId) => {
    try {
        const roundsRef = db.collection(`users/${userId}/rounds`);
        const mindsetRef = db.collection(`users/${userId}/mindset`);
        const [roundsSnapshot, mindsetSnapshot] = await Promise.all([
            roundsRef.get(),
            mindsetRef.get(),
        ]);
        const rounds = roundsSnapshot.docs
            .map(doc => (Object.assign({ id: doc.id }, doc.data())))
            .sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
        const mindsetEntries = mindsetSnapshot.docs
            .map(doc => (Object.assign({ id: doc.id }, doc.data())))
            .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
        if (rounds.length < 1) { // Changed to 1 for testing
            console.log("Not enough data to analyze.");
            return;
        }
        const winRate = calculateWinRate(rounds);
        const avgMultiplier = calculateAvgMultiplier(rounds);
        const riskRewardRatio = calculateRiskReward(rounds);
        const bestRange = findBestRange(rounds);
        const revengeBettingScore = detectRevengeBetting(rounds);
        const emotionalBiasScore = analyzeEmotionalCorrelation(rounds, mindsetEntries);
        const performanceSummary = `You show consistency in the ${bestRange} range, but a ${revengeBettingScore}% revenge betting score and a ${emotionalBiasScore}% emotional bias suggest decisions are sometimes emotionally driven.`;
        const aiSuggestion = revengeBettingScore > 50 ? "Take a 5-minute break after every 2 consecutive losses to reset." : "Your strategy is solid. Focus on maintaining discipline during drawdowns.";
        const analyticsData = {
            winRate,
            avgMultiplier,
            riskRewardRatio,
            bestRange,
            profitConsistencyScore: 75,
            lossStreaks: 3,
            emotionalBiasScore,
            performanceSummary,
            aiSuggestion,
        };
        const aiComment = generateAiComment(analyticsData);
        const finalResult = Object.assign(Object.assign({}, analyticsData), { aiComment, lastAnalyzed: firestore_1.Timestamp.now() });
        const analyticsDocRef = db.doc(`users/${userId}/analytics/latest`);
        await analyticsDocRef.set(finalResult);
        console.log(`Successfully analyzed performance for user ${userId}`);
    }
    catch (error) {
        console.error("Error in AI Strategy Engine: ", error);
    }
};
exports.analyzeUserPerformance = analyzeUserPerformance;
//# sourceMappingURL=aiAnalysis.js.map