"use client";

import { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { db } from '@/firebase/firebase';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';

export function Journal() {
  const [newEntry, setNewEntry] = useState('');
  const { user } = useAuth();

  const addEntry = async () => {
    if (!newEntry.trim() || !user) return;

    try {
      // Create a new journal entry with proper Firestore Timestamp
      const newJournalEntry = {
        content: newEntry,
        timestamp: Timestamp.now()
      };

      // Get the user's document
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      // Get existing entries or initialize empty array
      const existingEntries = userDoc.exists() 
        ? (userDoc.data().journalEntries || [])
        : [];

      // Add new entry to the beginning of the array
      const updatedEntries = [newJournalEntry, ...existingEntries];

      // Save to Firestore
      await updateDoc(userDocRef, {
        journalEntries: updatedEntries
      });

      // Clear the input
      setNewEntry('');
      
      console.log('Journal entry saved successfully:', newJournalEntry);
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
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
