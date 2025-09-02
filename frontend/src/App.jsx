// // App.jsx
// import { useEffect, useRef, useState } from "react";
// import Sidebar from "./components/Sidebar";
// import ChatPanel from "./components/ChatPanel";
// import ModelSwitcher from "./components/ModelSwitcher";
// import { createSession, getSession, listSessions, saveSessionMessages } from "./api/client";

// function getUserId() {
//   let userId = localStorage.getItem("user_id");
//   if (!userId) { 
//     userId = crypto.randomUUID(); 
//     localStorage.setItem("user_id", userId); 
//   }
//   return userId;
// }

// export default function App() {
//   const userId = useRef(getUserId());
//   const [sessions, setSessions] = useState([]);
//   const [current, setCurrent] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [pm, setPM] = useState({ provider: "openai", model: "gpt-4o-mini" });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const refreshSessions = async () => {
//     try {
//       setLoading(true);
//       const sessionsList = await listSessions(userId.current);
//       setSessions(sessionsList);
      
//       if (sessionsList.length && !current) {
//         await selectSession(sessionsList[0].id);
//       }
      
//       setError(null);
//     } catch (err) {
//       setError("Failed to load sessions");
//       console.error("Failed to refresh sessions:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectSession = async (sessionId) => {
//     try {
//       setCurrent(sessionId);
//       const messages = await getSession(sessionId);
//       setHistory(Array.isArray(messages) ? messages : []);
//     } catch (err) {
//       setHistory([]);
//       console.error("Failed to pick session:", err);
//     }
//   };

//   const createNewSession = async () => {
//     try {
//       const response = await createSession(userId.current, "New Chat");
      
//       if (response?.session_id) {
//         const newSession = {
//           id: response.session_id,
//           user_id: userId.current,
//           title: "New Chat",
//           created_at: new Date().toISOString()
//         };
        
//         setSessions(prev => [newSession, ...prev]);
//         setCurrent(response.session_id);
//         setHistory([]);
//       } else {
//         throw new Error("No session_id returned");
//       }
//     } catch (err) {
//       console.error("Failed to add session:", err);
//       setError("Failed to create new session");
//     }
//   };

//   const handleUserSend = async (message) => {
//     setHistory(prevHistory => {
//       const newHistory = [...prevHistory, message];
//       if (current) {
//         saveSessionMessages(current, newHistory).catch(err => {
//           console.error("Failed to save messages:", err);
//         });
//       }
//       return newHistory;
//     });
//   };

//   const handleAssistantDelta = (delta) => {
//     setHistory(prevHistory => {
//       let newHistory;
      
//       if (pm.provider === "gemini") {
//         const content = delta && delta.trim() ? delta : "No response from Gemini.";
//         newHistory = [...prevHistory, { 
//           role: "assistant", 
//           content, 
//           provider: pm.provider, 
//           model: pm.model 
//         }];
//       } else {
//         const lastMessage = prevHistory[prevHistory.length - 1];
        
//         if (!lastMessage || lastMessage.role !== "assistant") {
//           newHistory = [...prevHistory, { 
//             role: "assistant", 
//             content: delta, 
//             provider: pm.provider, 
//             model: pm.model 
//           }];
//         } else {
//           newHistory = [...prevHistory];
//           newHistory[newHistory.length - 1] = { 
//             ...lastMessage, 
//             content: (lastMessage.content || "") + delta 
//           };
//         }
//       }
      
//       if (current) {
//         saveSessionMessages(current, newHistory).catch(err => {
//           console.error("Failed to save messages:", err);
//         });
//       }
      
//       return newHistory;
//     });
//   };

//   const handleAssistantDone = () => {
//     // No action needed currently
//   };

//   useEffect(() => { 
//     refreshSessions(); 
//   }, []);

//   return (
//     <div className="layout" style={{ display: 'flex', height: '100vh' }}>
//       <Sidebar 
//         sessions={sessions} 
//         currentId={current} 
//         onNew={createNewSession} 
//         onPick={selectSession} 
//       />
      
//       <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//         <div className="toolbar">
//           <ModelSwitcher value={pm} onChange={setPM} />
//         </div>
        
//         {error && (
//           <div 
//             className="error-message"
//             role="alert"
//             style={{ padding: '1rem', color: 'var(--error)' }}
//           >
//             {error}
//           </div>
//         )}
        
//         {loading ? (
//           <div className="loading" aria-label="Loading" style={{ padding: '2rem', textAlign: 'center' }}>
//             Loading sessions...
//           </div>
//         ) : current ? (
//           <div className="chat-panel" style={{ flex: 1 }}>
//             <ChatPanel
//               sessionId={current}
//               provider={pm.provider}
//               model={pm.model}
//               history={history}
//               onUserSend={handleUserSend}
//               onAssistantDelta={handleAssistantDelta}
//               onAssistantDone={handleAssistantDone}
//             />
//           </div>
//         ) : (
//           <div className="empty" style={{ padding: '2rem', textAlign: 'center' }}>
//             Create a new chat to begin.
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


// App.jsx
import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import ModelSwitcher from "./components/ModelSwitcher";
import { createSession, getSession, listSessions, saveSessionMessages } from "./api/client";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./api/firebase";
import Auth from "./components/Auth";

function getUserId() {
  let userId = localStorage.getItem("user_id");
  if (!userId) { 
    userId = crypto.randomUUID(); 
    localStorage.setItem("user_id", userId); 
  }
  return userId;
}

export default function App() {
  const userId = useRef(getUserId());
  const [firebaseUser, setFirebaseUser] = useState(null); // NEW
  const [sessions, setSessions] = useState([]);
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [pm, setPM] = useState({ provider: "openai", model: "gpt-4o-mini" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  const refreshSessions = async () => {
    try {
      setLoading(true);
      const sessionsList = await listSessions(userId.current);
      setSessions(sessionsList);

      if (sessionsList.length && !current) {
        await selectSession(sessionsList[0].id);
      }

      setError(null);
    } catch (err) {
      setError("Failed to load sessions");
      console.error("Failed to refresh sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectSession = async (sessionId) => {
    try {
      setCurrent(sessionId);
      const messages = await getSession(sessionId);
      setHistory(Array.isArray(messages) ? messages : []);
    } catch (err) {
      setHistory([]);
      console.error("Failed to pick session:", err);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await createSession(userId.current, "New Chat");

      if (response?.session_id) {
        const newSession = {
          id: response.session_id,
          user_id: userId.current,
          title: "New Chat",
          created_at: new Date().toISOString()
        };

        setSessions(prev => [newSession, ...prev]);
        setCurrent(response.session_id);
        setHistory([]);
      } else {
        throw new Error("No session_id returned");
      }
    } catch (err) {
      console.error("Failed to add session:", err);
      setError("Failed to create new session");
    }
  };

  const handleUserSend = async (message) => {
    setHistory(prevHistory => {
      const newHistory = [...prevHistory, message];
      if (current) {
        saveSessionMessages(current, newHistory).catch(err => {
          console.error("Failed to save messages:", err);
        });
      }
      return newHistory;
    });
  };

  const handleAssistantDelta = (delta) => {
    setHistory(prevHistory => {
      let newHistory;

      if (pm.provider === "gemini") {
        const content = delta && delta.trim() ? delta : "No response from Gemini.";
        newHistory = [...prevHistory, { 
          role: "assistant", 
          content, 
          provider: pm.provider, 
          model: pm.model 
        }];
      } else {
        const lastMessage = prevHistory[prevHistory.length - 1];

        if (!lastMessage || lastMessage.role !== "assistant") {
          newHistory = [...prevHistory, { 
            role: "assistant", 
            content: delta, 
            provider: pm.provider, 
            model: pm.model 
          }];
        } else {
          newHistory = [...prevHistory];
          newHistory[newHistory.length - 1] = { 
            ...lastMessage, 
            content: (lastMessage.content || "") + delta 
          };
        }
      }

      if (current) {
        saveSessionMessages(current, newHistory).catch(err => {
          console.error("Failed to save messages:", err);
        });
      }

      return newHistory;
    });
  };

  const handleAssistantDone = () => {
    // No action needed currently
  };

  useEffect(() => {
    if (firebaseUser) {
      refreshSessions();
    }
  }, [firebaseUser]);

  // 🚧 Not logged in? Show Auth component only
  if (!firebaseUser) {
    return <Auth />;
  }

  // ✅ Show main UI if logged in
  return (
    <div className="layout" style={{ display: 'flex', height: '100vh' }}>
      <Sidebar 
        sessions={sessions} 
        currentId={current} 
        onNew={createNewSession} 
        onPick={selectSession} 
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="toolbar" style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 1rem" }}>
          <ModelSwitcher value={pm} onChange={setPM} />
          <button onClick={() => signOut(auth)}>Logout</button>
        </div>

        {error && (
          <div className="error-message" role="alert" style={{ padding: '1rem', color: 'var(--error)' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading" aria-label="Loading" style={{ padding: '2rem', textAlign: 'center' }}>
            Loading sessions...
          </div>
        ) : current ? (
          <div className="chat-panel" style={{ flex: 1 }}>
            <ChatPanel
              sessionId={current}
              provider={pm.provider}
              model={pm.model}
              history={history}
              onUserSend={handleUserSend}
              onAssistantDelta={handleAssistantDelta}
              onAssistantDone={handleAssistantDone}
            />
          </div>
        ) : (
          <div className="empty" style={{ padding: '2rem', textAlign: 'center' }}>
            Create a new chat to begin.
          </div>
        )}
      </main>
    </div>
  );
}

