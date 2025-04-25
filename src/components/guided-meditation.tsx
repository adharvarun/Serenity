"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const meditations = [
  {
    id: '1',
    title: 'Mindful Breathing',
    duration: '5 minutes',
    audioUrl: '/audio/mindful-breathing.mp3', // Replace with actual URLs
  },
  {
    id: '2',
    title: 'Body Scan Meditation',
    duration: '10 minutes',
    audioUrl: '/audio/body-scan.mp3',
  },
  // Add more meditation options
];

export const GuidedMeditation = () => {
  const [selectedMeditation, setSelectedMeditation] = useState(meditations[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleMeditationChange = (value: string) => {
    setSelectedMeditation(value);
  };

  const handlePlayPause = () => {
    if (!audio) {
      const newAudio = new Audio(meditations.find(m => m.id === selectedMeditation)?.audioUrl);
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
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
              {meditations.map((meditation) => (
                <SelectItem key={meditation.id} value={meditation.id}>
                  {meditation.title} ({meditation.duration})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handlePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </CardContent>
    </Card>
  );
};

