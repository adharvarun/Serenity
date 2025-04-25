
"use client";

import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar"

export const DailyCheckIn = () => {
  const [mood, setMood] = useState('');
  const [activities, setActivities] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission logic here (e.g., storing data in local storage or sending to a server)
    console.log('Mood:', mood);
    console.log('Activities:', activities);
    alert('Daily check-in submitted!');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="mood" className="block text-sm font-medium text-gray-700">
          How are you feeling today?
        </label>
        <select
          id="mood"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          <option value="">Select mood</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="stressed">Stressed</option>
          <option value="anxious">Anxious</option>
          <option value="calm">Calm</option>
        </select>
      </div>

      <div>
        <label htmlFor="activities" className="block text-sm font-medium text-gray-700">
          What activities did you participate in today? (comma-separated)
        </label>
        <input
          type="text"
          id="activities"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={activities}
          onChange={(e) => setActivities(e.target.value)}
        />
      </div>
      <div>
        <Calendar/>
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  );
};
