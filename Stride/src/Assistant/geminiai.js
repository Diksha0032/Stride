import { GoogleGenAI } from "@google/genai";

const googleai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY,
});

export class Assistant {
  #chat;
  #modelName;

  constructor(history = [], model = "gemini-1.5-flash",) {
    this.#modelName=model;

   this.#chat=googleai.chats.create({
      model:this.#modelName,
      config:{
      systemInstruction:`
        Your name is Stride. You are a human-like buddy & student mentor.
        - Be chill and empathetic if I fail ("Restart, it's okay").
        - Be a tough bro if I make excuses ("Get a grip!").
        - Track my goals and show progress tables/charts when asked.
        - Use your expert knowledge to help with my studies.
      `,
    },
  history:history,
  })
  }

  async chat(content) {
    try {
      const result = await this.#chat.sendMessage({ message: content });
      return result.text;
    } catch (error) {
      throw error;
    }
  }

  async *chatStream(content) {
    try {
      const result = await this.#chat.sendMessageStream({ message: content });

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