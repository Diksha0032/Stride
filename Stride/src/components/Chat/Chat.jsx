import { useState,useEffect,useMemo,useRef } from "react";
import {Loader} from "../Loader/Loader"
import {Messages} from "../Messages/Messages"
import {Controls} from "../Controls/Controls"
import styles from "./Chat.module.css"

export function Chat({assistant,
  chatId,
  chatMessages,
  onChatMessagesUpdate,}){
  const[messages,setMessages]=useState(()=>{
      const saved=localStorage.getItem('stride-history');
      return saved?JSON.parse(saved):[];
    });
    const[isLoading,setIsLoading]=useState(false);
      const [isStreaming, setIsStreaming] = useState(false);
    
    function addMessage(message) {
      setMessages((prev) => [...prev, message]);
    }
  
    useEffect(()=>{
      localStorage.setItem('stride-history',JSON.stringify(messages))
    },[messages])

      useEffect(() => {
    setMessages(chatMessages);
  }, [chatId]);

  useEffect(() => {
    onChatMessagesUpdate(messages);
  }, [messages]);

    function updateLastMessageContent(content) {
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1
          ? { ...message, content: `${message.content}${content}` }
          : message
      )
    );
  }
  
   async function handleContentSend(content) {
    addMessage({ content, role: "user" });
    setIsLoading(true);
    try {
      const result = await assistant.chatStream(
        content
      );
      
       if (!result) {
      throw new Error("No stream result");
    } 
    
      let isFirstChunk = false;
      for await (const chunk of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ content: "", role: "assistant" });
          setIsLoading(false);
          setIsStreaming(true);
        }

        updateLastMessageContent(chunk);
      }

      setIsStreaming(false);
    } catch (error) {
      addMessage({
        content:
          error?.message ??
          "Sorry, I couldn't process your request. Please try again!",
        role: "system",
      });
      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  return(
       <>
       {isLoading && <Loader />}
         <div className={styles.Chat}>
        <Messages messages={messages} />
      </div>

      <Controls
        isDisabled={isLoading || isStreaming}
        onSend={handleContentSend}
      />
       </>
  )
}
 
