// Sidebar.jsx
import React from "react";

export default function Sidebar({ sessions, onNew, onPick, currentId }) {
  const handleNewChat = () => {
    onNew();
  };

  const handleSelectChat = (id) => {
    onPick(id);
  };

  return (
    <aside 
      className="sidebar"
      role="region"
      aria-label="Chat sidebar"
    >
      <div className="sidebar-header">
        <button
          onClick={handleNewChat}
          className="new-chat-btn"
          aria-label="Start a new chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>
      
      <div className="chat-history">
        <h3>Chat History</h3>
        
        <ul role="list">
          {sessions.length === 0 && (
            <li className="text-gray-500 dark:text-gray-400 italic text-sm">
              No chats yet.
            </li>
          )}
          
          {sessions.map(({ id, title }) => (
            <li key={id}>
              <button
                onClick={() => handleSelectChat(id)}
                className={`chat-item ${id === currentId ? 'active' : ''}`}
                aria-current={id === currentId ? "page" : undefined}
              >
                <span className="chat-title">{title || "Untitled"}</span>
                {id === currentId && (
                  <span 
                    className="active-indicator" 
                    aria-hidden="true"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}