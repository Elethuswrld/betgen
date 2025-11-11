import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { analyzeUserPerformance } from './aiAnalysis';

admin.initializeApp();

/**
 * Cloud Function that triggers on a new round creation.
 * It runs the AI analysis for the user who created the round.
 */
export const onRoundCreated = functions.firestore
    .document('/users/{userId}/rounds/{roundId}')
    .onCreate(async (snap, context) => {
        const { userId } = context.params;
        console.log(`New round created for user: ${userId}. Triggering AI analysis.`);
        
        try {
             await analyzeUserPerformance(userId);

        } catch (error) {
            console.error(`Failed to run AI analysis for user ${userId}`, error);
        }
    });
