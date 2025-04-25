"use client";

import { useState, useEffect } from "react";
import { Auth } from '@/components/auth';
import { TodoList } from '@/components/todo-list';
import { Journal } from '@/components/journal';
import { AiWellbeingScore } from '@/components/ai-wellbeing-score';
import { YogaSessions } from '@/components/yoga-sessions';
import { GuidedMeditation } from '@/components/guided-meditation';
import { BreathingExercises } from '@/components/breathing-exercises';
import { MindfulnessActivities } from '@/components/mindfulness-activities';
import { Chatbot } from '@/components/chatbot';
import { ThemeToggle } from "@/components/theme-toggle"
import { MessageSquare, LogOut } from "lucide-react"
import { useRouter } from "next/navigation";

const moodOptions = [
  { emoji: "😊", label: "Happy", color: "bg-green-100 dark:bg-green-900" },
  { emoji: "😌", label: "Calm", color: "bg-blue-100 dark:bg-blue-900" },
  { emoji: "😔", label: "Sad", color: "bg-gray-100 dark:bg-gray-700" },
  { emoji: "😡", label: "Angry", color: "bg-red-100 dark:bg-red-900" },
  { emoji: "😴", label: "Tired", color: "bg-purple-100 dark:bg-purple-900" },
];

interface User {
  name: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [meditationTime, setMeditationTime] = useState(0);
  const [yogaTime, setYogaTime] = useState(0);
  const [breathingTime, setBreathingTime] = useState(0);

  useEffect(() => {
    // Check if user is authenticated
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (!token) {
      setUser(null);
      return;
    }

    // In a real app, you would verify the token and get user data
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const calculateWellnessScore = () => {
    const moodScore = selectedMood ? 20 : 0;
    const meditationScore = Math.min(meditationTime * 0.5, 30);
    const yogaScore = Math.min(yogaTime * 0.4, 30);
    const breathingScore = Math.min(breathingTime * 0.3, 20);
    return Math.round(moodScore + meditationScore + yogaScore + breathingScore);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-75 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Serenity
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Welcome, {user.name}
          </p>
        </div>
        <div className="px-4">
          <Chatbot />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Welcome back, {user.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your wellness journey
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Mood Section */}
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

          {/* Wellness Score Section */}
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

          {/* Activities Section */}
          <div className="grid grid-cols-1 gap-6">
            {/* Yoga Sessions - Larger Section */}
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
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">Made with ❤️ by <a href="https://github.com/adharvarun" target="_blank" rel="noopener noreferrer">Adharv Arun</a></p>
      </main>
    </div>
  );
}

