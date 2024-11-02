// app/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// app/page.tsx
import io from "socket.io-client";
const socket = io({
  path: "/api/socket", // Specify the path to match the API route
});

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ text: string; timestamp: string; sender: string }[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      router.push('/login');
    } else {
      setUsername(storedUsername);
    }

    // Listen for incoming messages from the server
    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up the socket listener on component unmount
    return () => {
      socket.off("message");
    };
  }, [router]);

  // Function to handle sending a message
  const sendMessage = () => {
    if (input.trim()) {
      const message = { text: input, timestamp: new Date().toLocaleTimeString(), sender: username };
      socket.emit("message", message);  // Send message to the server
      setInput('');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Welcome, {username}</h1>
      <div style={styles.chatWindow}>
        <div style={styles.messageList}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={message.sender === username ? styles.selfMessage : styles.otherMessage}
            >
              <span style={styles.messageText}>{message.text}</span>
              <span style={styles.timestamp}>{message.timestamp}</span>
            </div>
          ))}
        </div>
        <div style={styles.inputArea}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.button}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  chatWindow: {
    width: '400px',
    height: '500px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  messageList: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
  },
  selfMessage: {
    textAlign: 'right',
    margin: '10px 0',
    color: 'blue',
  },
  otherMessage: {
    textAlign: 'left',
    margin: '10px 0',
    color: 'green',
  },
  messageText: {
    display: 'inline-block',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: '#e0e0e0',
  },
  timestamp: {
    fontSize: '0.8em',
    marginLeft: '5px',
    color: '#888',
  },
  inputArea: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ddd',
  },
  input: {
    flex: 1,
    padding: '10px',
    marginRight: '5px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

