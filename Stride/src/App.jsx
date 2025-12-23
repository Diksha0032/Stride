import { useMemo, useState,useEffect, useRef } from 'react'
import { Chat } from './components/Chat/Chat';
import { Controls } from './components/Controls/Controls';
import {Assistant} from "./Assistant/geminiai"
import { Loader } from './components/Loader/Loader';
import styles from './App.module.css'

function App() {
  const[messages,setMessages]=useState(()=>{
    const saved=localStorage.getItem('stride-history');
    return saved?JSON.parse(saved):[];
  });
  const[isLoading,setIsLoading]=useState(false);
  
  function addMessage(message) {
    setMessages((prev) => [...prev, message]);
  }

  const assistant = useMemo(()=>{
    const history=messages.map(m=>({
      role:m.role==="assistant"?"model":"user",
      parts:[{text:m.content}]
    }))
    return new Assistant(history)
  },[messages])

  useEffect(()=>{
    localStorage.setItem('stride-history',JSON.stringify(messages))
  },[messages])

  async function handleContentSend(content){
    console.log("sending to stride",content)
    addMessage({content,role:"user"});
    setIsLoading(true);
    try{
     const result=await assistant.chat(content);
     console.log("stride responded",result)
     addMessage({content:result,role:"assistant"})
    }catch(error){
      console.log("gemini error",error);
      addMessage({
        content:"Sorry,I couldn't process your request.Please try again.",
        role:"system",
      })
    }finally{
      setIsLoading(false);
    }

    }
  

  return (
    <div className={styles.App}>
      {isLoading && <Loader />}
      <header className={styles.Header}>
      <h2 className={styles.Title}>Stride</h2>
    </header>
    <div className={styles.ChatContainer}>
     <Chat messages={messages} />
    </div>
    <Controls isDisabled={isLoading} onSend={handleContentSend} />
    </div>
  )
}

export default App
