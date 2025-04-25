
import { DailyCheckIn } from '@/components/daily-checkin';
import { TodoList } from '@/components/todo-list';
import { Journal } from '@/components/journal';
import { AiWellbeingScore } from '@/components/ai-wellbeing-score';
import { YogaSessions } from '@/components/yoga-sessions';
import { GuidedMeditation } from '@/components/guided-meditation';
import { BreathingExercises } from '@/components/breathing-exercises';
import { MindfulnessActivities } from '@/components/mindfulness-activities';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Welcome to Serenity</h1>
      
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Daily Check-in</h2>
        <DailyCheckIn />
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Todo List</h2>
        <TodoList />
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Journal</h2>
        <Journal />
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">AI Wellbeing Score</h2>
        <AiWellbeingScore />
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Yoga Sessions</h2>
        <YogaSessions />
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Guided Meditation</h2>
        <GuidedMeditation />
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Breathing Exercises</h2>
        <BreathingExercises />
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Mindfulness Activities</h2>
        <MindfulnessActivities />
      </section>
    </div>
  );
}
