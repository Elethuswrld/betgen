
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, getDocs, doc, setDoc, getDoc, serverTimestamp, Timestamp, deleteDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { db, auth } from './firebase';
import CrashGameLogger from './components/CrashGameLogger';
import CrashGameHistory from './components/CrashGameHistory';
import LoginPage from './pages/LoginPage';
import AiCoach from './components/AiCoach';
import AiChat from './components/AiChat';
import AiStrategyPanel from './components/AiStrategyPanel';
import BankrollTracker from './components/BankrollTracker';
import PerformanceDashboard from './components/PerformanceDashboard';
import MindsetZone from './components/MindsetZone';
import MindsetHistoryPage from './pages/MindsetHistoryPage';
import UserProfilePage from './pages/UserProfilePage';
import SideNav from './components/SideNav'; // Import SideNav
import { Box } from '@mui/material';
import './index.css';

// ... (interface definitions remain the same)
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


const App: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  const [crashGames, setCrashGames] = useState<CrashGame[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mindsetEntries, setMindsetEntries] = useState<MindsetJournalEntry[]>([]);

  // ... (useEffect and other functions remain the same)

    useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          const initialProfile: UserProfile = {
            startingBalance: 1000,
            currentBalance: 1000,
            totalProfitLoss: 0,
            riskProfile: 'moderate',
            goals: 'Increase bankroll by 10% in the first month.'
          };
          await setDoc(userRef, { profile: initialProfile });
          setUserProfile(initialProfile);
        } else {
            setUserProfile(userSnap.data().profile as UserProfile);
        }

        const crashGamesCollection = collection(db, `users/${user.uid}/crashGames`);
        const crashGameSnapshot = await getDocs(crashGamesCollection);
        const crashGameList = crashGameSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CrashGame)).sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
        setCrashGames(crashGameList);

        const mindsetCollection = collection(db, `users/${user.uid}/mindset`);
        const mindsetSnapshot = await getDocs(mindsetCollection);
        const mindsetList = mindsetSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as MindsetJournalEntry)).sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
        setMindsetEntries(mindsetList);
      };

      fetchData();
    }
  }, [user]);

  const calculateProfit = (amount: number, cashOutMultiplier: number, crashPoint: number): number => {
    if (cashOutMultiplier > 0 && cashOutMultiplier <= crashPoint) {
      return amount * (cashOutMultiplier - 1);
    } else {
      return -amount;
    }
  };

  const updateBankroll = async (profit: number) => {
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      try {
          await runTransaction(db, async (transaction) => {
              const userDoc = await transaction.get(userRef);
              if (!userDoc.exists()) {
                  throw "User profile does not exist!";
              }
              const currentProfile = userDoc.data().profile as UserProfile;
              const newBalance = currentProfile.currentBalance + profit;
              const newTotalProfitLoss = currentProfile.totalProfitLoss + profit;

              transaction.update(userRef, { 
                  'profile.currentBalance': newBalance,
                  'profile.totalProfitLoss': newTotalProfitLoss 
                });

              setUserProfile({ ...currentProfile, currentBalance: newBalance, totalProfitLoss: newTotalProfitLoss });
          });
      } catch (e) {
          console.error("Bankroll update transaction failed: ", e);
      }
  }

  const handleAddCrashGame = async (newGame: Omit<CrashGame, 'outcome' | 'profit' | 'id' | 'timestamp'>) => {
    if(user){
      const profit = calculateProfit(newGame.amount, newGame.cashOutMultiplier, newGame.crashPoint);
      const outcome = profit >= 0 ? 'win' : 'loss';

      try {
        const docRef = await addDoc(collection(db, `users/${user.uid}/crashGames`), {
          ...newGame,
          profit,
          outcome,
          timestamp: serverTimestamp(),
        });
        
        const addedGame = { ...newGame, profit, outcome, id: docRef.id, timestamp: Timestamp.now() } as CrashGame;
        setCrashGames(prevGames => [addedGame, ...prevGames]);

        await updateBankroll(profit);

      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const handleDeleteGame = async (id: string) => {
    if(user){
        const gameToDelete = crashGames.find(game => game.id === id);
        if(!gameToDelete) return;

        try {
            await deleteDoc(doc(db, `users/${user.uid}/crashGames`, id));
            setCrashGames(prevGames => prevGames.filter(game => game.id !== id));
            await updateBankroll(-gameToDelete.profit);
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    }
  };

  const handleUpdateGame = async (id: string, updatedGameData: Partial<CrashGame>) => {
    if(user){
        const originalGame = crashGames.find(game => game.id === id);
        if(!originalGame) return;

        const gameWithUpdates = { ...originalGame, ...updatedGameData };
        const newProfit = calculateProfit(gameWithUpdates.amount, gameWithUpdates.cashOutMultiplier, gameWithUpdates.crashPoint);
        const newOutcome = newProfit >= 0 ? 'win' : 'loss';
        const profitDifference = newProfit - originalGame.profit;

        const finalUpdatedGame = { ...gameWithUpdates, profit: newProfit, outcome: newOutcome };

        try {
            const gameRef = doc(db, `users/${user.uid}/crashGames`, id);
            await updateDoc(gameRef, finalUpdatedGame);
            setCrashGames(prevGames => prevGames.map(game => game.id === id ? finalUpdatedGame as CrashGame : game));
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
        setMindsetEntries(prevEntries => [newEntry, ...prevEntries]);
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


  if (loading) {
    return <div className="bg-brand-dark text-brand-light min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
        <div className="bg-brand-dark text-brand-light min-h-screen font-sans">
            <Box sx={{ display: 'flex' }}>
                {user && <SideNav />}
                <Box component="main" sx={{ flexGrow: 1, ml: { lg: '280px' } }}>
                    <Routes>
                        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                        <Route path="/" element={user ? (
                            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                                <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                    <div className="lg:col-span-2">
                                        <CrashGameLogger onAddCrashGame={handleAddCrashGame} />
                                        <PerformanceDashboard crashGames={crashGames} />
                                        <CrashGameHistory crashGames={crashGames} onDeleteGame={handleDeleteGame} onUpdateGame={handleUpdateGame} />
                                    </div>
                                    <div className="lg:col-span-2">
                                        <AiStrategyPanel />
                                        <BankrollTracker profile={userProfile} />
                                        <AiChat />
                                        <MindsetZone onSave={handleSaveMindsetEntry} />
                                        <AiCoach crashGames={crashGames} mindsetEntries={mindsetEntries} />
                                    </div>
                                </main>
                            </div>
                        ) : <Navigate to="/login" />} />
                        <Route path="/mindset-history" element={user ? <MindsetHistoryPage /> : <Navigate to="/login" />} />
                        <Route path="/profile" element={user ? <UserProfilePage profile={userProfile} onUpdateProfile={handleUpdateProfile} /> : <Navigate to="/login" />} />
                    </Routes>
                </Box>
            </Box>
        </div>
    </BrowserRouter>
  );
};

export default App;
