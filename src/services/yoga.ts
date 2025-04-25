
/**
 * Represents a yoga session with a name, description, and level of difficulty.
 */
export interface YogaSession {
  /**
   * The name of the yoga session.
   */
  name: string;
  /**
   * A description of the yoga session.
   */
  description: string;
  /**
   * The level of difficulty of the yoga session (e.g., Beginner, Intermediate, Advanced).
   */
difficulty: string;
  /**
   * A link to stream the video for the yoga session.
   */
  videoUrl: string;
}

/**
 * Asynchronously retrieves a list of yoga sessions.
 *
 * @returns A promise that resolves to an array of YogaSession objects.
 */
export async function getYogaSessions(): Promise<YogaSession[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      name: 'Gentle Morning Flow',
      description: 'A gentle sequence to start your day with ease. This session is designed to wake up the body and calm the mind.',
      difficulty: 'Beginner',
      videoUrl: 'https://example.com/yoga/gentle-morning-flow',
    },
    {
      name: 'Energizing Vinyasa',
      description: 'A dynamic practice to build strength and stamina. Focus on breath and movement synchronization.',
      difficulty: 'Intermediate',
      videoUrl: 'https://example.com/yoga/energizing-vinyasa',
    },
    {
      name: 'Restorative Evening Practice',
      description: 'Unwind and release tension with this calming restorative session. Perfect for preparing for sleep.',
      difficulty: 'Beginner',
      videoUrl: 'https://example.com/yoga/restorative-evening-practice',
    },
  ];
}
