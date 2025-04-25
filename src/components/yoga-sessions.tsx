
"use client";

import { useState, useEffect } from 'react';
import { YogaSession, getYogaSessions } from '@/services/yoga';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const YogaSessions = () => {
  const [sessions, setSessions] = useState<YogaSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const yogaSessions = await getYogaSessions();
        setSessions(yogaSessions);
      } catch (error) {
        console.error('Error fetching yoga sessions:', error);
        alert('Failed to load yoga sessions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Loading yoga sessions...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{session.name}</CardTitle>
                <CardDescription>{session.difficulty}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{session.description}</p>
                <a href={session.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Watch Now
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
