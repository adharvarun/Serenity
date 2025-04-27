import { useState, useEffect } from 'react';
import { auth } from '@/firebase/firebase';
import { getPreviousJournalEntries } from '@/lib/firestore-operations';
import { Timestamp } from 'firebase/firestore';

interface JournalEntry {
  content: string;
  timestamp: Timestamp;
}

export function PreviousJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const journalEntries = await getPreviousJournalEntries(user.uid);
          setEntries(journalEntries);
        }
      } catch (error) {
        console.error('Error loading journal entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        No previous journal entries found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {entry.timestamp?.toDate?.()?.toLocaleDateString() || 'No date'}
          </div>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {entry.content}
          </p>
        </div>
      ))}
    </div>
  );
} 