import { GoogleGenAI } from "@google/genai";

const googleai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY,
});

export class Assistant {
  #chat;
  #modelName;
  #storageKey="stride-history";

  constructor(history = [], model = "gemini-2.5-flash",) {

    this.#modelName=model;

    const saved=localStorage.getItem(this.#storageKey);
    let History=[];

    if (saved) {
      try {

        const rawHistory = JSON.parse(saved);

        History=rawHistory.filter(entry=>entry.role==='user'|| entry.role==='model')
        console.log("Stride loaded history:", History.length, "messages found.");
      } catch (e) {
        console.error("Memory corruption:", e);
      }
    }

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
  history:History,
  })
  }
  
  #persist(){
    localStorage.setItem(this.#storageKey,JSON.stringify(this.#chat.history))
  }
  async chat(content) {
    try {
      const result = await this.#chat.sendMessage({ message: content });
      this.#persist();
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
        this.#persist();
      }
    } catch (error) {
      throw error;
    }
  }
}