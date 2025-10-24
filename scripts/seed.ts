import { collection, addDoc } from "firebase/firestore";
import { db } from "../src/firebase.js";
import { mockBets, mockPerformance } from "../src/mockData.js";

const seedDatabase = async () => {
  try {
    console.log("Seeding database...");
    const betsCollection = collection(db, "bets");
    const performanceCollection = collection(db, "performance");

    for (const bet of mockBets) {
      await addDoc(betsCollection, bet);
    }

    for (const performance of mockPerformance) {
      await addDoc(performanceCollection, performance);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } 
};

seedDatabase();
