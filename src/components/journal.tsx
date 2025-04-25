
"use client";

import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export const Journal = () => {
  const [entry, setEntry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle journal entry submission (e.g., store in local storage or send to a server)
    console.log('Journal Entry:', entry);
    alert('Journal entry saved!');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="journal" className="block text-sm font-medium text-gray-700">
          Write your thoughts and feelings here:
        </label>
        <Textarea
          id="journal"
          rows={4}
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
      </div>

      <Button type="submit">Save Entry</Button>
    </form>
  );
};
