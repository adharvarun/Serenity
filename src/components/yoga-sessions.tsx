"use client";

import { yogaSessions } from "@/data/wellness";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const YogaSessions = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {yogaSessions.map((session, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{session.title}</CardTitle>
              <CardDescription>{session.duration}</CardDescription>
              <CardDescription>{session.level}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{session.description}</p>
              <a href={session.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-3 hover:underline">
                Watch Now
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
