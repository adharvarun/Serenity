
"use client";

import { useState } from 'react';
import { calculateWellbeingScore } from '@/ai/flows/wellbeing-score';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const AiWellbeingScore = () => {
  const [score, setScore] = useState<number | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCalculateScore = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - replace with actual user input
      const result = await calculateWellbeingScore({
        mood: 'Happy',
        activities: 'Exercise, Reading',
        journalEntry: 'Today was a good day. I feel productive and content.',
      });

      setScore(result.wellbeingScore);
      setSummary(result.summary);
    } catch (error) {
      console.error('Error calculating wellbeing score:', error);
      alert('Failed to calculate wellbeing score. Please try again.');
      setScore(null);
      setSummary('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your AI Wellbeing Score</CardTitle>
        <CardDescription>Based on your daily inputs</CardDescription>
      </CardHeader>
      <CardContent>
      {isLoading ? (
          <p>Calculating...</p>
        ) : score !== null ? (
          <>
            <p className="text-3xl font-semibold">{score}</p>
            <p className="text-sm mt-2">{summary}</p>
          </>
        ) : (
          <p>No score available. Provide your daily inputs to calculate your wellbeing score.</p>
        )}

        <button
          onClick={handleCalculateScore}
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4"
        >
          Calculate Score
        </button>
      </CardContent>
    </Card>
  );
};
