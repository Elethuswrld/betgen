"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRoundCreated = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const aiAnalysis_1 = require("./aiAnalysis");
admin.initializeApp();
/**
 * Cloud Function that triggers on a new round creation.
 * It runs the AI analysis for the user who created the round.
 */
exports.onRoundCreated = functions.firestore
    .document('/users/{userId}/rounds/{roundId}')
    .onCreate(async (snap, context) => {
    const { userId } = context.params;
    console.log(`New round created for user: ${userId}. Triggering AI analysis.`);
    try {
        await (0, aiAnalysis_1.analyzeUserPerformance)(userId);
    }
    catch (error) {
        console.error(`Failed to run AI analysis for user ${userId}`, error);
    }
});
//# sourceMappingURL=index.js.map