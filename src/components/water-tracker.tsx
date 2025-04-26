"use client";

import { useState, useEffect } from 'react';
import { auth, db } from '@/firebase/firebase';
import { saveUserData } from '@/lib/firestore-operations';
import { Timestamp, doc, getDoc } from 'firebase/firestore';

export function WaterTracker() {
  const [amount, setAmount] = useState(0);
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
            const todayData = data.waterIntake?.find(
              (entry: any) => entry.date.toDate().toDateString() === today.toDateString()
            );
            if (todayData) {
              setAmount(todayData.amount);
            }
          }
        }
      } catch (error) {
        console.error('Error loading water intake data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodayData();
  }, []);

  const handleAddWater = async (ml: number) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const existingData = userDoc.exists() ? userDoc.data() : {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newAmount = amount + ml;
        setAmount(newAmount);

        const updatedWaterIntake = [
          {
            date: Timestamp.fromDate(today),
            amount: newAmount
          },
          ...(existingData.waterIntake || []).filter(
            (entry: any) => entry.date.toDate().toDateString() !== today.toDateString()
          )
        ];

        await saveUserData(user.uid, {
          waterIntake: updatedWaterIntake
        });
      }
    } catch (error) {
      console.error('Error saving water intake data:', error);
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
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
          {amount}ml
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Water Intake Today
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[250, 500, 750].map((ml) => (
          <button
            key={ml}
            onClick={() => handleAddWater(ml)}
            className="py-2 px-4 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            +{ml}ml
          </button>
        ))}
      </div>
    </div>
  );
} 