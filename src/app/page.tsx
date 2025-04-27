"use client";

import { useState, useEffect } from "react";
import { Auth } from '@/components/auth';
import { TodoList } from '@/components/todo-list';
import { Journal } from '@/components/journal';
import { YogaSessions } from '@/components/yoga-sessions';
import { GuidedMeditation } from '@/components/guided-meditation';
import { BreathingExercises } from '@/components/breathing-exercises';
import { MindfulnessActivities } from '@/components/mindfulness-activities';
import { Chatbot } from '@/components/chatbot';
import { ThemeToggle } from "@/components/theme-toggle"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation";
import { auth } from '@/firebase/firebase';
import { signOut } from 'firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';
import { saveUserData, loadUserData, shouldResetData, resetDailyData } from '@/lib/firestore-operations';
import { PreviousJournalEntries } from '@/components/PreviousJournalEntries';
import { SleepTracker } from '@/components/sleep-tracker';
import { WaterTracker } from '@/components/water-tracker';

const moodOptions = [
  { emoji: "😊", label: "Happy", color: "bg-green-100 dark:bg-green-900" },
  { emoji: "😌", label: "Calm", color: "bg-blue-100 dark:bg-blue-900" },
  { emoji: "😔", label: "Sad", color: "bg-gray-100 dark:bg-gray-700" },
  { emoji: "😡", label: "Angry", color: "bg-red-100 dark:bg-red-900" },
  { emoji: "😴", label: "Tired", color: "bg-purple-100 dark:bg-purple-900" },
];

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [meditationTime, setMeditationTime] = useState(0);
  const [yogaTime, setYogaTime] = useState(0);
  const [breathingTime, setBreathingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: FirebaseUser | null) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }, (error: Error) => {
      console.error('Auth state change error:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Check if we need to reset data for the new day
          const shouldReset = await shouldResetData(user.uid);
          if (shouldReset) {
            await resetDailyData(user.uid);
          } else {
            // Load existing data
            const userData = await loadUserData(user.uid);
            if (userData) {
              setSelectedMood(userData.mood);
              setMeditationTime(userData.meditationTime);
              setYogaTime(userData.yogaTime);
              setBreathingTime(userData.breathingTime);
            }
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadData();
  }, []);

  const calculateWellnessScore = () => {
    const moodScore = selectedMood ? 20 : 0;
    const meditationScore = Math.min(meditationTime * 0.5, 30);
    const yogaScore = Math.min(yogaTime * 0.4, 30);
    const breathingScore = Math.min(breathingTime * 0.3, 20);
    return Math.round(moodScore + meditationScore + yogaScore + breathingScore);
  };

  // Save data whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          await saveUserData(user.uid, {
            mood: selectedMood,
            meditationTime,
            yogaTime,
            breathingTime,
            wellnessScore: calculateWellnessScore()
          });
        }
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    };

    if (auth.currentUser) {
      saveData();
    }
  }, [selectedMood, meditationTime, yogaTime, breathingTime, calculateWellnessScore]);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser({
      uid: userData.email,
      email: userData.email,
      displayName: userData.name,
      photoURL: null
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-[400px] fixed h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Serenity
          </h1>
          <Link href="/profile" className="flex items-center space-x-2">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user.displayName?.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
        </div>
        <div className="px-4">
          <Chatbot />
        </div>
      </aside>

      <main className="flex-1 ml-[400px] h-full overflow-y-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              Welcome back, {user.displayName}
              <p className="text-sm text-gray-400 border-gray-400 border-solid border px-[5px] py-[3px] rounded-full ml-1">{time}</p>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your wellness journey
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 hover:bg-red-100 dark:hover:bg-red-900"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">How are you feeling today?</h2>
            <div className="grid grid-cols-5 gap-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg ${mood.color} hover:opacity-80 transition-opacity ${
                    selectedMood === mood.label ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <span className="text-3xl mb-2">{mood.emoji}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Wellness Score Calculator</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meditation Time (minutes)
                </label>
                <input
                  type="number"
                  value={meditationTime}
                  onChange={(e) => setMeditationTime(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Yoga Time (minutes)
                </label>
                <input
                  type="number"
                  value={yogaTime}
                  onChange={(e) => setYogaTime(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Breathing Exercises (minutes)
                </label>
                <input
                  type="number"
                  value={breathingTime}
                  onChange={(e) => setBreathingTime(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {calculateWellnessScore()}%
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Your Wellness Score
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Sleep Tracker</h2>
              <SleepTracker />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Water Intake</h2>
              <WaterTracker />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Yoga Sessions</h2>
              <YogaSessions />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Guided Meditation</h2>
                <GuidedMeditation />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Breathing Exercises</h2>
                <BreathingExercises />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Mindfulness Activities</h2>
                <MindfulnessActivities />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Journal</h2>
                <Journal />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Todo List</h2>
                <TodoList />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Previous Journal Entries</h2>
            <PreviousJournalEntries />
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">Made with ❤️ by <a href="https://github.com/adharvarun" target="_blank" rel="noopener noreferrer">Adharv Arun</a></p>
      </main>
    </div>
  );
}

