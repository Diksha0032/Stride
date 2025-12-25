import { useMemo, useState } from 'react'
import { Chat } from './components/Chat/Chat';
import {Sidebar} from "./components/Sidebar/Sidebar"
import {Assistant} from "./Assistant/geminiai"
//import {Theme} from "./components/Theme/Theme"
import styles from './App.module.css'

const CHATS = [
  {
    id: 2,
    title: "Gemini AI vs ChatGPT",
    messages: [
      { role: "user", content: "What is better ChatGPT or Gemini?" },
      {
        role: "assistant",
        content: "Hi! Can you explain for what type of tasks you will use it?",
      },
    ],
  },
  {
    id: 4,
    title: "How to use AI tools in your daily life",
    messages: [
      { role: "user", content: "Hey! How to use AI in my life?" },
      {
        role: "assistant",
        content: "Hi! Would you like to use it for work or for hobbies?",
      },
    ],
  },
];

function App() {
  const [chats, setChats] = useState(CHATS);
  const [activeChatId, setActiveChatId] = useState(2);
  const activeChatMessages = useMemo(
    () => chats.find(({ id }) => id === activeChatId)?.messages ?? [],
    [chats, activeChatId]
  );

  function updateChats(messages = []) {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId ? { ...chat, messages } : chat
      )
    );
  }

  function handleChatMessagesUpdate(messages) {
    updateChats(messages);
  }

  const assistant = useMemo(()=>{
      const history=activeChatMessages.map(m=>({
        role:m.role==="assistant"?"model":"user",
        parts:[{text:m.content}]
      }))
      return new Assistant(history,"gemini-2.5-flash")
    },[activeChatId,activeChatMessages])
  
  return (
    <div className={styles.App}>
      <header className={styles.Header}>
      <h2 className={styles.Title}>Stride</h2>
    </header>
      <div className={styles.Content}>
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onActiveChatIdChange={setActiveChatId}
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
