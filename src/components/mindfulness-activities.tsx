"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const activities = [
  { id: '1', name: 'Take a walk in nature' },
  { id: '2', name: 'Practice deep breathing' },
  { id: '3', name: 'Listen to calming music' },
  { id: '4', name: 'Write in a gratitude journal' },
  { id: '5', name: 'Do a body scan meditation' },
];

export const MindfulnessActivities = () => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const handleActivityChange = (activityId: string) => {
    setSelectedActivities((prev) => {
      if (prev.includes(activityId)) {
        return prev.filter((id) => id !== activityId);
      } else {
        return [...prev, activityId];
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mindfulness Activities</CardTitle>
        <CardDescription>Engage in mindful practices to enhance your wellbeing</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-2">
            <Checkbox
              id={activity.id}
              checked={selectedActivities.includes(activity.id)}
              onCheckedChange={() => handleActivityChange(activity.id)}
            />
            <label
              htmlFor={activity.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {activity.name}
            </label>
          </div>
        ))}
        {selectedActivities.length > 0 && (
          <ul>
            <p>Selected Activities:</p>
            {selectedActivities.map((id) => (
              <li key={id} className="text-sm relative pl-4 before:content-['-'] before:absolute before:left-0">
                {activities.find((activity) => activity.id === id)?.name}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

