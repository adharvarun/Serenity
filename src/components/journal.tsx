"use client";

import { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { db } from '@/firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { Timestamp } from 'firebase/firestore';

export function Journal() {
  const [entries, setEntries] = useState<string[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchEntries = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setEntries(userDoc.data().journalEntries || []);
        }
      };
      fetchEntries();
    }
  }, [user]);

  const addEntry = async () => {
    if (!newEntry.trim() || !user) return;

    // Save as object with content and timestamp
    const newJournalEntry = {
      content: newEntry,
      timestamp: new Date(), // We'll convert to Firestore Timestamp on save
    };

    // Fetch existing entries (as objects)
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    let existingEntries = [];
    if (userDoc.exists()) {
      existingEntries = userDoc.data().journalEntries || [];
    }
    const updatedEntries = [newJournalEntry, ...existingEntries];
    setNewEntry('');

    // Save to Firestore, converting timestamp to Firestore Timestamp
    await updateDoc(doc(db, 'users', user.uid), {
      journalEntries: updatedEntries.map(entry => ({
        content: entry.content,
        timestamp: typeof entry.timestamp?.toDate === 'function' ? entry.timestamp : Timestamp.fromDate(new Date(entry.timestamp)),
      })),
    });
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={newEntry}
        onChange={(e) => setNewEntry(e.target.value)}
        placeholder="Write your thoughts..."
        className="w-full"
      />
      <Button
        onClick={addEntry}
        className="w-full"
      >
        Add Entry
      </Button>
    </div>
  );
}
