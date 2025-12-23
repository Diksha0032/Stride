import { useEffect,useMemo,useRef } from "react";
import styles from "./Chat.module.css"
import Markdown from "react-markdown"

const WELCOME_MESSAGE_GROUP = [
  {
  role:"assistant",
  content:"Ask questions",
},
]

export function Chat({messages}){
   const messageEndRef=useRef(null);
   const messagesGroups=useMemo(()=>messages.reduce((groups,message)=>{
    if(message.role==='user') groups.push([]);
    groups[groups.length-1].push(message);
    return groups;
   },[]),[messages])
  
   useEffect(()=>{
    messageEndRef.current?.scrollIntoView({behavior:'smooth'})
   },[messages])

  return(
    <div className={styles.Chat}>
      {[WELCOME_MESSAGE_GROUP,...messagesGroups].map(
        (messages,groupIndex)=>(
        <div key={groupIndex} className={styles.Group}>
          {messages.map(({role,content},index)=>(
        <div key={index} className={styles.Message} data-role={role}><Markdown>{content}</Markdown></div>
          ))}
    </div>
  ))}
  <div ref={messageEndRef} />
  </div>
  )}
