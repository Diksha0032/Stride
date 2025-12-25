// geminiai.js - Complete rewrite for @google/genai
import { GoogleGenAI } from "@google/genai";

const googleai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY,
});

export class Assistant {
  #model;

  constructor(history = [], model = "gemini-1.5-flash") {
    this.#model = model;
  }

  async chat(content) {
    try {
      const chat = googleai.chats.create({ model: this.#model });
      const result = await chat.sendMessage({ message: content });
      return result.text;
    } catch (error) {
      throw error;
    }
  }

  async *chatStream(content) {
    try {
      const chat = googleai.chats.create({ model: this.#model });
      const result = await chat.sendMessageStream({ message: content });

      for await (const chunk of result) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error) {
      throw error;
    }
  }
}