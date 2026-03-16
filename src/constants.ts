import { ChatMode } from "./types";

export const QUICK_REPLIES: Record<ChatMode, string[]> = {
  standard: [
    "Tell me a joke",
    "What's the weather?",
    "Help me plan my day",
    "Who are you?",
    "Tell me a fun fact"
  ],
  friend: [
    "Kya haal hai?",
    "Kuch interesting batao",
    "Chalo baatein karte hain",
    "Aaj ka kya plan hai?",
    "Ek gana sunao"
  ],
  mixed: [
    "Generate an image of a futuristic city",
    "Search for latest AI news",
    "Analyze this image",
    "What's happening in the world?",
    "Create a digital art prompt"
  ],
  coding: [
    "Explain recursion in JavaScript",
    "React vs Vue comparison",
    "How to use Docker?",
    "Write a Python script for web scraping",
    "Best practices for REST APIs"
  ],
  business: [
    "Startup ideas for 2024",
    "Market trends in tech",
    "How to write a business plan?",
    "Marketing strategies for small business",
    "Explain venture capital"
  ],
  study: [
    "Summarize the concept of Quantum Physics",
    "Quiz me on World History",
    "Create a study schedule for exams",
    "Explain the Pythagorean theorem",
    "Tips for effective learning"
  ]
};
