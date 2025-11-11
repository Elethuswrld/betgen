
import { collection, getDocs, query, orderBy, limit, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming your firebase config is in '../firebase'

// --- TYPE DEFINITIONS ---

interface CrashGame {
    id?: string;
    game: string;
    amount: number;
    cashOutMultiplier: number;
    crashPoint: number;
    outcome: 'win' | 'loss';
    profit: number;
    notes: string;
    mindset: string;
    reasonForEntry: string;
    timestamp: any; // Firestore Timestamp
}

interface MindsetJournalEntry {
    preSessionGoals: string;
    confidence: number;
    lessonsLearned: string;
    disciplineScore: number;
    emotionalBiasScore: number;
    timestamp: any; // Firestore Timestamp
}

interface Analytics {
    totalRounds: number;
    winRate: number;
    averageMultiplier: number;
    totalProfitLoss: number;
    bestStreak: number;
    worstStreak: number;
    emotionalBiasScore: number;
    lastAnalyzed: any; // Firestore Timestamp
    insights: string[];
}

// --- CORE ANALYSIS ENGINE ---

class AIStrategyEngine {
    private userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    async fetchRounds(count: number = 100): Promise<CrashGame[]> {
        const roundsRef = collection(db, `users/${this.userId}/crashGames`);
        const q = query(roundsRef, orderBy('timestamp', 'desc'), limit(count));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as CrashGame);
    }

    async fetchMindsetEntries(count: number = 20): Promise<MindsetJournalEntry[]> {
        const mindsetRef = collection(db, `users/${this.userId}/mindset`);
        const q = query(mindsetRef, orderBy('timestamp', 'desc'), limit(count));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as MindsetJournalEntry);
    }

    calculateMetrics(rounds: CrashGame[]): Partial<Analytics> {
        const totalRounds = rounds.length;
        if (totalRounds === 0) {
            return { totalRounds: 0, winRate: 0, averageMultiplier: 0, totalProfitLoss: 0, bestStreak: 0, worstStreak: 0 };
        }

        const wins = rounds.filter(r => r.outcome === 'win').length;
        const totalProfitLoss = rounds.reduce((acc, r) => acc + r.profit, 0);
        const winRate = totalRounds > 0 ? (wins / totalRounds) * 100 : 0;
        
        const validMultipliers = rounds.filter(r => r.cashOutMultiplier > 0);
        const averageMultiplier = validMultipliers.length > 0
            ? validMultipliers.reduce((acc, r) => acc + r.cashOutMultiplier, 0) / validMultipliers.length
            : 0;

        let bestStreak = 0;
        let worstStreak = 0;
        let currentWinStreak = 0;
        let currentLossStreak = 0;

        rounds.forEach(round => {
            if (round.outcome === 'win') {
                currentWinStreak++;
                currentLossStreak = 0;
                bestStreak = Math.max(bestStreak, currentWinStreak);
            } else {
                currentLossStreak++;
                currentWinStreak = 0;
                worstStreak = Math.max(worstStreak, currentLossStreak);
            }
        });

        return {
            totalRounds,
            winRate,
            averageMultiplier,
            totalProfitLoss,
            bestStreak,
            worstStreak,
        };
    }
    
    detectBehavioralPatterns(rounds: CrashGame[], mindsetEntries: MindsetJournalEntry[]): { insights: string[], emotionalBiasScore: number } {
        const insights: string[] = [];
        let emotionalBiasScore = 0;

        if (rounds.length < 5) {
            return { insights: ['Log at least 5 games to start receiving personalized insights.'], emotionalBiasScore: 0 };
        }

        const tiltedLosses = rounds.filter(r => r.mindset === 'Tilted' && r.outcome === 'loss').length;
        if(tiltedLosses > 2 && tiltedLosses / rounds.filter(r => r.mindset === 'Tilted').length > 0.6){
            insights.push('Tilt Warning: You lose a significant majority of games when tilted. Take a break immediately after a loss when feeling tilted.');
            emotionalBiasScore += 40;
        }

        const focusedWins = rounds.filter(r => r.mindset === 'Focused' && r.outcome === 'win').length;
        const totalFocusedGames = rounds.filter(r => r.mindset === 'Focused').length;
        if(totalFocusedGames > 3 && focusedWins / totalFocusedGames > 0.7){
            insights.push('Focus Pays Off: Your win rate is exceptionally high when you are focused. Identify what gets you in this state and replicate it.');
        }

        if(mindsetEntries.length > 0){
            const latestMindset = mindsetEntries[0];
            if(latestMindset.disciplineScore < 5){
                insights.push('Discipline Dip: Your last session had a low discipline score. Let\'s focus on sticking to your predefined strategy today.');
                emotionalBiasScore += 15;
            }
            if(latestMindset.confidence < 5){
                insights.push('Confidence Check: Your confidence was low in the last session. Trust in your strategy and analysis, not momentary fear.');
                emotionalBiasScore += 10;
            }
            if(latestMindset.emotionalBiasScore > 70){
                insights.push('Emotional Trading Alert: You reported a high emotional bias recently. This is a major red flag. Acknowledge the emotion, but let logic guide your hand.');
                emotionalBiasScore += latestMindset.emotionalBiasScore * 0.5; // Weight the reported bias
            }
        }

        // Final insight based on score
        if (emotionalBiasScore > 65) {
            insights.push('Your Emotional Bias Score is critically high. It is strongly recommended to take a break and reassess your mental state before playing again.');
        } else if (emotionalBiasScore > 40) {
            insights.push('Your Emotional Bias Score is elevated. Be mindful of making impulsive decisions. Stick to your plan.');
        }
        
        return { insights: [...new Set(insights)], emotionalBiasScore: Math.min(100, emotionalBiasScore) }; // Remove duplicates
    }


    async runFullAnalysis(): Promise<Analytics> {
        const rounds = await this.fetchRounds();
        const mindsetEntries = await this.fetchMindsetEntries();
        const metrics = this.calculateMetrics(rounds);
        const { insights, emotionalBiasScore } = this.detectBehavioralPatterns(rounds, mindsetEntries);

        const analytics: Analytics = {
            ...metrics,
            insights,
            emotionalBiasScore,
            lastAnalyzed: new Date(),
        } as Analytics;

        // Save to Firestore
        const analyticsRef = doc(db, `users/${this.userId}/analytics`, 'latest');
        await setDoc(analyticsRef, analytics, { merge: true });

        return analytics;
    }

    /**
     * @description Simulates predicting an optimal multiplier range based on past performance.
     * @returns {object} An object containing a suggested multiplier range and a confidence score.
     */
    predictOptimalMultiplier(): { range: string; confidence: number } {
        // Placeholder logic
        // In a real scenario, this would involve a more complex statistical model or ML.
        const baseMultiplier = 1.5;
        const confidence = 70 + Math.random() * 15; // Simulate confidence between 70-85%
        const rangeStart = (baseMultiplier + Math.random() * 0.5).toFixed(2);
        const rangeEnd = (parseFloat(rangeStart) + 0.3 + Math.random() * 0.5).toFixed(2);
        
        return {
            range: `${rangeStart}x - ${rangeEnd}x`,
            confidence: parseFloat(confidence.toFixed(2)),
        };
    }
}

export default AIStrategyEngine;
