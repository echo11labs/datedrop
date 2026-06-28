export const QUESTIONS = [
  { id: 1, question: "What's my favorite comfort food?", emoji: "🍕" },
  { id: 2, question: "What song have I had on repeat lately?", emoji: "🎵" },
  { id: 3, question: "What's my dream vacation destination?", emoji: "✈️" },
  { id: 4, question: "What always makes me laugh?", emoji: "😂" },
  { id: 5, question: "What's my biggest pet peeve?", emoji: "😤" },
  { id: 6, question: "What's my favorite way to spend a Sunday?", emoji: "☀️" },
  { id: 7, question: "What's my go-to coffee or drink order?", emoji: "☕" },
  { id: 8, question: "What movie can I watch over and over?", emoji: "🎬" },
  { id: 9, question: "What's my love language?", emoji: "💝" },
  { id: 10, question: "What's the first thing I notice about someone?", emoji: "👀" },
];

export type Answer = {
  questionId: number;
  text: string;
};
