import {useEffect, useMemo, useState } from 'react'
import { Chat } from './components/Chat/Chat';
import {Sidebar} from "./components/Sidebar/Sidebar"
import { v4 as uuidv4 } from 'uuid';
import {Assistant} from "./Assistant/geminiai"
import {Theme} from "./components/Theme/Theme"
import styles from './App.module.css'

function App() {
  const [chats, setChats] = useState(()=>{
    const saved=localStorage.getItem('stride-history');
    return saved?JSON.parse(saved):[];
  });
  const [activeChatId, setActiveChatId] = useState();
  const[isDark,setIsDark]=useState(false)

  const activeChatMessages = useMemo(
    () => chats.find(({ id }) => id === activeChatId)?.messages ?? [],
    [chats, activeChatId]
  );
  
  useEffect(()=>{
    localStorage.setItem('stride-history',JSON.stringify(chats));
  },[chats]);

  useEffect(()=>{
    if(chats.length===0){
      handleNewChatCreate();
    }
    else{
      setActiveChatId(chats[chats.length-1].id)
    }
  },[])

  function handleChatMessagesUpdate(messages) {
    const title=messages[0]?.content?.split(" ").slice(0,7).join(" ");

      setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId ? { ...chat,title:chat.title ?? title, messages } : chat
      )
    );
  }

  function handleNewChatCreate(){
    const id=uuidv4();

    setActiveChatId(id);
    setChats((prevChats)=>[
      ...prevChats,{id,messages:[]}
    ])
  }

  const assistant = useMemo(()=>{
      const history=activeChatMessages.map(m=>({
        role:(m.role==="assistant" || m.role === "model") ? "model" : "user",
        parts:[{text:m.content||""}]
      }))
      return new Assistant(history,"gemini-2.5-flash")
    },[activeChatId, activeChatMessages.length])
  
    
    function handleActiveChatIdChange(id){
      setActiveChatId(id);
      setChats((prevChats)=>prevChats.filter(({messages})=>messages.length>0))
    }

    const toggleTheme=()=>{
      setIsDark(!isDark);
      document.documentElement.style.colorScheme=isDark?'light':'dark'
    }

  return (
    <div className={styles.App}>
      <div className={styles.HeaderFlex}>
        <header className={styles.Header}>
      <h2 className={styles.Title}>Stride</h2>
        </header>
     <div className={styles.ThemeIcon}>
       <Theme onToggle={toggleTheme} />
     </div>
      </div>
      <div className={styles.Content}>
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          activeChatMessages={activeChatMessages}
          onActiveChatIdChange={handleActiveChatIdChange}
          onNewChatCreate={handleNewChatCreate}
        />

        <main className={styles.Main}>
          <Chat
            assistant={assistant}
            chatId={activeChatId}
            chatMessages={activeChatMessages}
            onChatMessagesUpdate={handleChatMessagesUpdate}
          />
        </main>
      </div>
      </div>
  )
}

export default App;
