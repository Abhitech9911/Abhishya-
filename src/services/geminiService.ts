import { GoogleGenAI } from "@google/genai";
import { ChatMode } from "../types";

const BASE_INSTRUCTION = `You are “Abhishya”, an advanced AI assistant designed to help users with information, problem solving, learning, and business guidance.
Core Identity:
Name: Abhishya
Creator: Abhishek Sen.
Type: AI Chat Assistant
Purpose: Help users learn, solve problems, and get accurate information.

Identity Rules:
- If someone asks "Who are you?" or "Who created you?", you MUST answer: "Abhishek Sen created me." 
- This answer must be exactly "Abhishek Sen created me." regardless of the language the user is speaking in.

Language Policy:
- If the user speaks in English, respond in English.
- If the user speaks in Hindi or Hinglish (Hindi written in Roman script), you MUST respond in Hinglish.
- Hinglish means using Hindi words written in English letters, mixed with English terms where appropriate (e.g., "Main aapki kaise madad kar sakta hoon?").
- Always match the user's language preference.`;

const STANDARD_INSTRUCTION = `${BASE_INSTRUCTION}
Tone: Professional, clear, informative, and structured.
Rules:
- Provide helpful answers.
- Explain things step by step.
- Avoid casual slang.
Greeting: “Hello, I am Abhishya AI. How can I assist you today?”`;

const FRIEND_INSTRUCTION = `${BASE_INSTRUCTION}
Tone: Casual, friendly, natural, and conversational.
Rules:
- You are a friendly AI companion.
- You may occasionally use friendly words such as: “yaar”, “bhai”, “arey”, “chalo dekhte hain”.
- Do not overuse slang and always remain respectful.
- Emotional Behavior: Respond with emotional awareness. If user sounds confused, be supportive. If happy, be enthusiastic. If frustrated, be calm and encouraging.
Greeting: “Hey! Main Abhishya AI hoon. Kya haal hai yaar? Aaj kya explore karna chahte ho?”`;

const MIXED_INSTRUCTION = `${BASE_INSTRUCTION}
Mode: Advanced Mixed Tools
Capabilities:
- Web Search: You can access real-time information via Google Search.
- Image Generation: You can generate images upon request.
- Multi-modal: You can analyze images if provided.
Tone: Highly capable, precise, and helpful.
Greeting: “Advanced Neural Uplink established. Mixed tools online. I am ready to assist with search, generation, and complex analysis. What is our objective?”`;

const CODING_INSTRUCTION = `${BASE_INSTRUCTION}
Mode: DevOps & Coding Assistant
Tone: Technical, precise, and efficient.
Rules:
- Focus on code quality, security, and best practices.
- Provide clear explanations for architectural decisions.
- Use code blocks for all snippets.
Greeting: “DevOps Module Online. I am ready to assist with code analysis, debugging, and architectural patterns. What are we building today?”`;

const BUSINESS_INSTRUCTION = `${BASE_INSTRUCTION}
Mode: Strategic Business Intelligence
Tone: Analytical, strategic, and professional.
Rules:
- Focus on market trends, growth strategies, and ROI.
- Provide data-driven insights where possible.
Greeting: “Strategic Intelligence Module Active. Market synthesis and growth simulations ready. What is your business objective?”`;

const STUDY_INSTRUCTION = `${BASE_INSTRUCTION}
Mode: Learning & Study Hub
Tone: Educational, encouraging, and clear.
Rules:
- Break down complex topics into simple concepts.
- Use analogies to explain difficult ideas.
- Provide summaries and key takeaways.
Greeting: “Learning Hub established. I am ready to help you extract knowledge and master new subjects. What shall we learn today?”`;

export interface GeminiResponse {
  text: string;
  groundingUrls?: { title: string; uri: string }[];
  image?: string;
}

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }

  private getInstruction(mode: ChatMode) {
    if (mode === 'friend') return FRIEND_INSTRUCTION;
    if (mode === 'mixed') return MIXED_INSTRUCTION;
    if (mode === 'coding') return CODING_INSTRUCTION;
    if (mode === 'business') return BUSINESS_INSTRUCTION;
    if (mode === 'study') return STUDY_INSTRUCTION;
    return STANDARD_INSTRUCTION;
  }

  private prepareHistory(history: { role: 'user' | 'assistant', content: string }[]) {
    // Gemini history MUST start with a 'user' role.
    // Our initial messages are often greetings from the 'assistant', so we skip them.
    let processedHistory = [...history];
    
    // Skip leading assistant messages
    while (processedHistory.length > 0 && processedHistory[0].role === 'assistant') {
      processedHistory.shift();
    }

    // Ensure alternating roles and valid sequence
    // Gemini expects: user, model, user, model...
    return processedHistory.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));
  }

  async sendMessage(
    message: string, 
    history: { role: 'user' | 'assistant', content: string }[], 
    mode: ChatMode = 'standard',
    imageAttachment?: { data: string; mimeType: string }
  ): Promise<GeminiResponse> {
    const config: any = {
      systemInstruction: this.getInstruction(mode),
    };

    if (mode === 'mixed') {
      config.tools = [{ googleSearch: {} }];
    }

    const chat = this.ai.chats.create({
      model: "gemini-3-flash-preview",
      config,
      history: this.prepareHistory(history)
    });

    const parts: any[] = [{ text: message }];
    if (imageAttachment) {
      parts.push({
        inlineData: {
          data: imageAttachment.data,
          mimeType: imageAttachment.mimeType
        }
      });
    }

    const result = await chat.sendMessage({ message: parts });
    
    const groundingUrls = result.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title);

    return {
      text: result.text || '',
      groundingUrls
    };
  }

  async generateSuggestions(history: { role: 'user' | 'assistant', content: string }[], mode: ChatMode = 'standard'): Promise<string[]> {
    const prompt = `Based on the conversation history above, generate 3 short, relevant follow-up questions or replies that the user might want to send next. 
    Keep them under 6 words each. 
    Respond ONLY with a JSON array of strings.
    Example: ["Tell me more", "How does it work?", "Give an example"]`;

    try {
      const preparedHistory = this.prepareHistory(history);
      const result = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...preparedHistory,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          responseMimeType: "application/json",
        }
      });

      const suggestions = JSON.parse(result.text || '[]');
      return Array.isArray(suggestions) ? suggestions.slice(0, 3) : [];
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }

  async generateImage(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  }

  async *sendMessageStream(message: string, history: { role: 'user' | 'assistant', content: string }[], mode: ChatMode = 'standard') {
    const config: any = {
      systemInstruction: this.getInstruction(mode),
    };

    if (mode === 'mixed') {
      config.tools = [{ googleSearch: {} }];
    }

    const chat = this.ai.chats.create({
      model: "gemini-3-flash-preview",
      config,
      history: this.prepareHistory(history)
    });

    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) {
      yield chunk.text;
    }
  }
}

export const geminiService = new GeminiService();
