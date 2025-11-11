
import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from 'firebase/auth';

interface MindsetJournalEntry {
  id: string;
  preSessionGoals: string;
  confidence: number;
  lessonsLearned: string;
  disciplineScore: number;
  emotionalBiasScore: number;
  timestamp: any;
}

const useMindsetEntries = (user: User | null) => {
  const [entries, setEntries] = useState<MindsetJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        const mindsetCollection = collection(db, `users/${user.uid}/mindset`);
        const q = query(mindsetCollection, orderBy('timestamp', 'desc'));
        const mindsetSnapshot = await getDocs(q);
        const mindsetList = mindsetSnapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as MindsetJournalEntry)
        );
        setEntries(mindsetList);
        setLoading(false);
      }
    };

    fetchEntries();
  }, [user]);

  return { entries, loading };
};

export default useMindsetEntries;
