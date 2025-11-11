
import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  runTransaction,
} from 'firebase/firestore';
import { User } from 'firebase/auth';

// Interfaces
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
  timestamp: Timestamp;
}

interface UserProfile {
  startingBalance: number;
  currentBalance: number;
  totalProfitLoss: number;
  riskProfile: string;
  goals: string;
}

interface MindsetJournalEntry {
  id?: string;
  preSessionGoals: string;
  confidence: number;
  lessonsLearned: string;
  disciplineScore: number;
  emotionalBiasScore: number;
  timestamp: Timestamp;
}

const useFirestore = (user: User | null) => {
  const [crashGames, setCrashGames] = useState<CrashGame[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mindsetEntries, setMindsetEntries] = useState<MindsetJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateProfit = (amount: number, cashOutMultiplier: number, crashPoint: number): number => {
    if (cashOutMultiplier > 0 && cashOutMultiplier <= crashPoint) {
      return amount * (cashOutMultiplier - 1);
    } else {
      return -amount;
    }
  };

  const updateBankroll = useCallback(async (profit: number) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw 'User profile does not exist!';
        }
        const currentProfile = userDoc.data().profile as UserProfile;
        const newBalance = currentProfile.currentBalance + profit;
        const newTotalProfitLoss = currentProfile.totalProfitLoss + profit;

        transaction.update(userRef, {
          'profile.currentBalance': newBalance,
          'profile.totalProfitLoss': newTotalProfitLoss,
        });

        setUserProfile({ ...currentProfile, currentBalance: newBalance, totalProfitLoss: newTotalProfitLoss });
      });
    } catch (e) {
      console.error('Bankroll update transaction failed: ', e);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const fetchData = async () => {
        try {
          // Fetch or create user profile
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            const initialProfile: UserProfile = {
              startingBalance: 1000,
              currentBalance: 1000,
              totalProfitLoss: 0,
              riskProfile: 'moderate',
              goals: 'Increase bankroll by 10% in the first month.',
            };
            await setDoc(userRef, { profile: initialProfile });
            setUserProfile(initialProfile);
          } else {
            setUserProfile(userSnap.data().profile as UserProfile);
          }

          // Fetch crashGames
          const crashGamesCollection = collection(db, `users/${user.uid}/rounds`);
          const crashGameSnapshot = await getDocs(crashGamesCollection);
          const crashGameList = crashGameSnapshot.docs
            .map((doc) => ({ ...doc.data(), id: doc.id } as CrashGame))
            .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
          setCrashGames(crashGameList);

          // Fetch mindset entries
          const mindsetCollection = collection(db, `users/${user.uid}/mindset`);
          const mindsetSnapshot = await getDocs(mindsetCollection);
          const mindsetList = mindsetSnapshot.docs
            .map((doc) => ({ ...doc.data(), id: doc.id } as MindsetJournalEntry))
            .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
          setMindsetEntries(mindsetList);
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [user]);

  const handleAddCrashGame = async (newCrashGame: Omit<CrashGame, 'outcome' | 'profit' | 'id' | 'timestamp'>) => {
    if (user) {
      const profit = calculateProfit(newCrashGame.amount, newCrashGame.cashOutMultiplier, newCrashGame.crashPoint);
      const outcome = profit >= 0 ? 'win' : 'loss';

      try {
        const docRef = await addDoc(collection(db, `users/${user.uid}/rounds`), {
          ...newCrashGame,
          profit,
          outcome,
          timestamp: serverTimestamp(),
        });

        const addedCrashGame = { ...newCrashGame, profit, outcome, id: docRef.id, timestamp: Timestamp.now() } as CrashGame;
        setCrashGames((prevCrashGames) => [addedCrashGame, ...prevCrashGames]);

        await updateBankroll(profit);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const handleDeleteCrashGame = async (id: string) => {
    if (user) {
      const gameToDelete = crashGames.find((game) => game.id === id);
      if (!gameToDelete) return;

      try {
        await deleteDoc(doc(db, `users/${user.uid}/rounds`, id));
        setCrashGames((prevCrashGames) => prevCrashGames.filter((game) => game.id !== id));
        await updateBankroll(-gameToDelete.profit);
      } catch (e) {
        console.error("Error deleting document: ", e);
      }
    }
  };

  const handleUpdateCrashGame = async (id: string, updatedCrashGameData: Partial<CrashGame>) => {
    if (user) {
      const originalGame = crashGames.find((game) => game.id === id);
      if (!originalGame) return;

      const gameWithUpdates = { ...originalGame, ...updatedCrashGameData };
      const newProfit = calculateProfit(gameWithUpdates.amount, gameWithUpdates.cashOutMultiplier, gameWithUpdates.crashPoint);
      const newOutcome = newProfit >= 0 ? 'win' : 'loss';
      const profitDifference = newProfit - originalGame.profit;

      const finalUpdatedGame = { ...gameWithUpdates, profit: newProfit, outcome: newOutcome };

      try {
        const gameRef = doc(db, `users/${user.uid}/rounds`, id);
        await updateDoc(gameRef, finalUpdatedGame);
        setCrashGames((prevGames) =>
          prevGames.map((game) => (game.id === id ? (finalUpdatedGame as CrashGame) : game))
        );
        await updateBankroll(profitDifference);
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    }
  };

  const handleSaveMindsetEntry = async (entry: Omit<MindsetJournalEntry, 'timestamp' | 'id'>) => {
    if (user) {
      try {
        const docRef = await addDoc(collection(db, `users/${user.uid}/mindset`), {
          ...entry,
          timestamp: serverTimestamp(),
        });
        const newEntry = { ...entry, id: docRef.id, timestamp: Timestamp.now() } as MindsetJournalEntry;
        setMindsetEntries((prevEntries) => [newEntry, ...prevEntries]);
      } catch (e) {
        console.error("Error adding mindset entry: ", e);
      }
    }
  };

  const handleUpdateProfile = async (newProfile: UserProfile) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { profile: newProfile }, { merge: true });
      setUserProfile(newProfile);
    }
  };

  return {
    crashGames,
    userProfile,
    mindsetEntries,
    loading,
    handleAddCrashGame,
    handleDeleteCrashGame,
    handleUpdateCrashGame,
    handleSaveMindsetEntry,
    handleUpdateProfile,
  };
};

export default useFirestore;
