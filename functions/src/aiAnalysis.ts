
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

const db = admin.firestore();

// This is a placeholder for the AIStrategyEngine logic. 
// In a real-world scenario, you would share this logic between your client and functions.
const runAnalysis = async (userId: string) => {
    const roundsRef = db.collection(`users/${userId}/crashGames`);
    const snapshot = await roundsRef.orderBy('timestamp', 'desc').limit(100).get();
    const rounds = snapshot.docs.map(doc => doc.data());

    const totalRounds = rounds.length;
    const wins = rounds.filter(r => r.outcome === 'win').length;
    const winRate = totalRounds > 0 ? (wins / totalRounds) * 100 : 0;
    const totalProfitLoss = rounds.reduce((acc, r) => acc + r.profit, 0);
    const averageMultiplier = rounds.length > 0 
        ? rounds.reduce((acc, r) => acc + (r.cashOutMultiplier || 0), 0) / rounds.length 
        : 0;

    const analytics = {
        totalRounds,
        winRate,
        averageMultiplier,
        totalProfitLoss,
        lastAnalyzed: admin.firestore.FieldValue.serverTimestamp(),
        insights: ['Cloud function analysis is active!'] // Placeholder insight
    };

    const analyticsRef = db.doc(`users/${userId}/analytics/latest`);
    await analyticsRef.set(analytics, { merge: true });

    return analytics;
}

export const analyzeNewRound = functions.firestore
    .document('users/{userId}/crashGames/{gameId}')
    .onCreate(async (snap, context) => {
        const { userId } = context.params;
        console.log(`New round detected for user ${userId}, running analysis...`);

        try {
            await runAnalysis(userId);
            console.log(`Analysis complete for user ${userId}`);

            // Auto-post a chat message
            const chatMessage = {
                text: "🤖 I've analyzed your latest round. Check your dashboard for updated insights!",
                sender: "ai",
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            };
            await db.collection(`users/${userId}/chat`).add(chatMessage);

        } catch (error) {
            console.error(`Failed to analyze round for user ${userId}:`, error);
        }
    });
