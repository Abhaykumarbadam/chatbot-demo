import React, { useState, useEffect, useRef } from "react";
import useSSE from "../hooks/useSSE";
import { marked } from "marked";

export default function ChatPanel({
  sessionId,
  provider,
  model,
  history,
  onUserSend,
  onAssistantDelta,
  onAssistantDone,
}) {
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [body, setBody] = useState(null);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, streaming]);

  useEffect(() => {
    setError("");
  }, [sessionId]);

  useSSE({
    url: streaming
      ? `${import.meta.env.VITE_API_BASE || "http://localhost:8003"}/chat/${sessionId}/stream`
      : null,
    body,
    onDelta: (deltaOrError) => {
      if (typeof deltaOrError === "string") {
        onAssistantDelta(deltaOrError);
      } else if (deltaOrError?.error) {
        setError(deltaOrError.error);
      }
    },
    onDone: () => {
      setStreaming(false);
      onAssistantDone();
    },
    onError: (err) => {
      setStreaming(false);
      setError(err?.message || "Unknown error");
    },
  });

  const handleSend = () => {
    if (!input.trim() || !sessionId || streaming) return;
    const msg = { role: "user", content: input, provider, model };
    const msgs = [...history, msg];
    onUserSend(msg);
    setBody({ messages: msgs, provider, model });
    setStreaming(true);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyErrorToClipboard = () => {
    navigator.clipboard.writeText(error);
  };

  const getMessageClass = (role) => {
    switch (role) {
      case "user":
        return "message user";
      case "assistant":
        return "message assistant";
      default:
        return "message error";
    }
  };

  return (
    <div 
      className="chat-panel"
      role="region"
      aria-label="Chat panel"
    >
      <div 
        className="messages-container"
        aria-live="polite"
      >
        {history.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8 select-none">
            Start the conversation by typing below...
          </p>
        )}
        
        {history.map((message, index) => (
          <div
            key={index}
            className={getMessageClass(message.role)}
            role={message.role === "user" ? "status" : "article"}
          >
            <div className="message-content">
              <div
                dangerouslySetInnerHTML={{ __html: marked.parse(message.content || "") }}
              />
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(message.content)}
              className="copy-btn"
              aria-label="Copy message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="m4 16c-1.1 0-2-.9-2-2v-10c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
            </button>
          </div>
        ))}
        
        {error && (
          <div 
            className="message error"
            role="alert"
          >
            <div className="error-content">
              <p>{error}</p>
            </div>
            <button
              onClick={copyErrorToClipboard}
              className="copy-btn"
              aria-label="Copy error to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="m4 16c-1.1 0-2-.9-2-2v-10c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
            </button>
          </div>
        )}
        
        {streaming && (
          <div 
            className="typing-indicator"
            aria-label="Assistant is typing"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={streaming}
            aria-label="Message input"
          />
          
          {!streaming ? (
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`send-btn ${!input.trim() ? 'disabled' : ''}`}
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setStreaming(false)}
              className="stop-btn"
              aria-label="Stop generating"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="6" width="12" height="12"></rect>
              </svg>
              Stop Generating
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
