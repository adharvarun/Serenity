"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export const BreathingExercises = () => {
  const [inhale, setInhale] = useState(4);
  const [hold, setHold] = useState(0);
  const [exhale, setExhale] = useState(4);
  const [rounds, setRounds] = useState(4);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);

  const handleStart = () => {
    setIsRunning(true);
    setCurrentRound(1);
  };

  const handleNextRound = () => {
    if (currentRound < rounds) {
      setCurrentRound(currentRound + 1);
    } else {
      setIsRunning(false);
      setCurrentRound(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Breathing Exercises</CardTitle>
        <CardDescription>Set your rhythm for relaxation</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="inhale">Inhale (seconds)</label>
          <Slider
            id="inhale"
            defaultValue={[inhale]}
            max={10}
            step={1}
            onValueChange={(value) => setInhale(value[0])}
            disabled={isRunning}
          />
          <p className="text-sm text-muted-foreground">Inhale for {inhale} seconds</p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="hold">Hold (seconds)</label>
          <Slider
            id="hold"
            defaultValue={[hold]}
            max={10}
            step={1}
            onValueChange={(value) => setHold(value[0])}
            disabled={isRunning}
          />
          <p className="text-sm text-muted-foreground">Hold for {hold} seconds</p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="exhale">Exhale (seconds)</label>
          <Slider
            id="exhale"
            defaultValue={[exhale]}
            max={10}
            step={1}
            onValueChange={(value) => setExhale(value[0])}
            disabled={isRunning}
          />
          <p className="text-sm text-muted-foreground">Exhale for {exhale} seconds</p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="rounds">Number of Rounds</label>
          <Slider
            id="rounds"
            defaultValue={[rounds]}
            max={10}
            step={1}
            onValueChange={(value) => setRounds(value[0])}
            disabled={isRunning}
          />
          <p className="text-sm text-muted-foreground">{rounds} rounds</p>
        </div>

        {!isRunning ? (
          <Button onClick={handleStart} disabled={isRunning}>Start Breathing</Button>
        ) : (
          <div>
            <p>Round {currentRound} of {rounds}</p>
            <Button onClick={handleNextRound}>Next Round</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

