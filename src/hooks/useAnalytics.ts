
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from 'firebase/auth';

interface Analytics {
  totalRounds: number;
  winRate: number;
  totalProfitLoss: number;
  riskRating?: number;
  suggestedAction?: string;
}

const useAnalytics = (user: User | null) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, 'users', user.uid, 'analytics', 'latest'), (doc) => {
        if (doc.exists()) {
          const data = doc.data() as Analytics;
          data.riskRating = Math.round(Math.random() * 100); // Placeholder
          data.suggestedAction = data.totalProfitLoss > 0 ? "Keep up the great work!" : "Consider lowering your bet size."; // Placeholder

          setAnalytics(data);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  return { analytics, loading };
};

export default useAnalytics;
