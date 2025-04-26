"use client";

import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar"

export function DailyCheckin() {
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [stress, setStress] = useState(3);
  const [sleep, setSleep] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      mood,
      energy,
      stress,
      sleep,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('dailyCheckin', JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Mood</label>
        <input
          type="range"
          min="1"
          max="5"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label>Energy</label>
        <input
          type="range"
          min="1"
          max="5"
          value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label>Stress</label>
        <input
          type="range"
          min="1"
          max="5"
          value={stress}
          onChange={(e) => setStress(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label>Sleep</label>
        <input
          type="range"
          min="1"
          max="5"
          value={sleep}
          onChange={(e) => setSleep(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>
    </form>
  );
}
