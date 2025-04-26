"use client";

import { useState, useEffect } from 'react';
import { auth, db } from '@/firebase/firebase';
import { saveUserData } from '@/lib/firestore-operations';
import { Timestamp, doc, getDoc } from 'firebase/firestore';

export function SleepTracker() {
  const [hours, setHours] = useState(0);
  const [quality, setQuality] = useState(3);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTodayData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayData = data.sleepData?.find(
              (entry: any) => entry.date.toDate().toDateString() === today.toDateString()
            );
            if (todayData) {
              setHours(todayData.hours);
              setQuality(todayData.quality);
            }
          }
        }
      } catch (error) {
        console.error('Error loading sleep data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodayData();
  }, []);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const existingData = userDoc.exists() ? userDoc.data() : {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const updatedSleepData = [
          {
            date: Timestamp.fromDate(today),
            hours,
            quality
          },
          ...(existingData.sleepData || []).filter(
            (entry: any) => entry.date.toDate().toDateString() !== today.toDateString()
          )
        ];

        await saveUserData(user.uid, {
          sleepData: updatedSleepData
        });
      }
    } catch (error) {
      console.error('Error saving sleep data:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Hours of Sleep
        </label>
        <input
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sleep Quality (1-5)
        </label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setQuality(value)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                quality === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleSave}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save Sleep Data
      </button>
    </div>
  );
} 