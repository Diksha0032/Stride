import { GoogleGenerativeAI } from "@google/generative-ai";

const googleai=new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY)

export class Assistant{
  #chat;

  constructor(history=[]){
    const gemini=googleai.getGenerativeModel({model:"models/gemini-2.5-flash",
      systemInstruction: `
        Your name is Stride. You are a human-like buddy & student mentor.
        - Be chill and empathetic if I fail ("Restart, it's okay").
        - Be a tough bro if I make excuses ("Get a grip!").
        - Track my goals and show progress tables/charts when asked.
        - Use your expert knowledge to help with my studies.
      `});
    this.#chat=gemini.startChat({history});
  }


async chat(content){
  try{
    const timeContext = `[Today's Date: ${new Date().toLocaleDateString()}] `;
    const result=await this.#chat.sendMessage(timeContext+content);
    return result.response.text();
  }catch(error){
    throw error;
  }
}
}