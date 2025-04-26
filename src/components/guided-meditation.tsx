"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { guidedMeditations } from '@/data/wellness';

export const GuidedMeditation = () => {
  const [selectedMeditation, setSelectedMeditation] = useState<string>(guidedMeditations[0].id.toString());
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleMeditationChange = (value: string) => {
    setSelectedMeditation(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guided Meditation</CardTitle>
        <CardDescription>Find your inner peace</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="meditation">Select Meditation</label>
          <Select onValueChange={handleMeditationChange} defaultValue={selectedMeditation}>
            <SelectTrigger id="meditation">
              <SelectValue placeholder="Select a meditation" />
            </SelectTrigger>
            <SelectContent>
              {guidedMeditations.map((meditation) => (
                <SelectItem key={meditation.id} value={meditation.id.toString()}>
                  {meditation.title} ({meditation.duration})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => {
            const meditation = guidedMeditations.find(m => m.id.toString() === selectedMeditation);
            if (meditation) {
              window.location.href = meditation.audioUrl;
            }
          }}
        >
          Start Meditation
        </Button>
      </CardContent>
    </Card>
  );
};

