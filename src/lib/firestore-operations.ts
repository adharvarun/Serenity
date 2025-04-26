import { db } from '@/firebase/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';

interface UserData {
  mood: string | null;
  meditationTime: number;
  yogaTime: number;
  breathingTime: number;
  wellnessScore: number;
  journalEntries: Array<{
    content: string;
    timestamp: Timestamp;
  }>;
  todoList: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  sleepData: Array<{
    date: Timestamp;
    hours: number;
    quality: number; // 1-5 scale
  }>;
  waterIntake: Array<{
    date: Timestamp;
    amount: number; // in ml
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    dateCompleted?: Timestamp;
  }>;
  moodHistory: Array<{
    date: Timestamp;
    mood: string;
  }>;
}

export const saveUserData = async (userId: string, data: Partial<UserData>) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Update existing document
      await setDoc(userDocRef, {
        ...userDoc.data(),
        ...data,
        lastUpdated: Timestamp.now()
      }, { merge: true });
    } else {
      // Create new document
      await setDoc(userDocRef, {
        ...data,
        lastUpdated: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

export const loadUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error loading user data:', error);
    throw error;
  }
};

export const getPreviousJournalEntries = async (userId: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data() as UserData;
      return data.journalEntries || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting journal entries:', error);
    throw error;
  }
};

export const shouldResetData = async (userId: string): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      const lastUpdated = data.lastUpdated?.toDate();
      if (lastUpdated) {
        const today = new Date();
        return lastUpdated.getDate() !== today.getDate() ||
               lastUpdated.getMonth() !== today.getMonth() ||
               lastUpdated.getFullYear() !== today.getFullYear();
      }
    }
    return true;
  } catch (error) {
    console.error('Error checking reset condition:', error);
    return true;
  }
};

export const resetDailyData = async (userId: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data() as UserData;
      // Keep journal entries, reset everything else
      await setDoc(userDocRef, {
        journalEntries: data.journalEntries || [],
        lastUpdated: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error resetting daily data:', error);
    throw error;
  }
}; 