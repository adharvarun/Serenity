"use client";

import { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { db } from '@/firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';

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

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    setNewEntry('');

    await updateDoc(doc(db, 'users', user.uid), {
      journalEntries: updatedEntries,
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
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div key={index} className="p-2 border rounded">
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}
