"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import io from "socket.io-client";

// Initialize the socket connection
const socket = io({
  path: "/api/socket",
});

socket.on("connect", () => {
  console.log("Client connected with socket ID:", socket.id); // Log connection ID
});

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ text: string; timestamp: string; sender: string }[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      router.push('/login');
    } else {
      setUsername(storedUsername);
      socket.emit("user_connected", storedUsername);
    }

    // Listen for incoming messages
    socket.on("message", (msg) => {
      console.log("Received message from server:", msg); // Debug log
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Listen for updated user list
    socket.on("update_user_list", (userList: string[]) => {
      setUsers(userList);
    });

    return () => {
      socket.off("message");
      socket.off("update_user_list");
    };
  }, [router]);

  const sendMessage = () => {
    if (input.trim()) {
      const message = { text: input, timestamp: new Date().toLocaleTimeString(), sender: username };
      console.log("Sending message:", message); // Debug log
      socket.emit("message", message); // Send message to server
      setInput('');
    }
  };
  

  const logout = () => {
    localStorage.removeItem('username');
    router.push('/login');
  };

  return (
    <div style={styles.container}>
      <h1>Welcome, {username}</h1>
      <button onClick={logout} style={styles.button}>Logout</button>
      <div style={styles.userList}>
        <h3>Online Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>
      <div style={styles.chatWindow}>
        <div style={styles.messageList}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={message.sender === username ? styles.selfMessage : styles.otherMessage}
            >
              <span>{message.sender}: {message.text}</span>
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
          <button onClick={sendMessage} style={styles.button}>Send</button>
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
    padding: '20px',
  },
  userList: {
    width: '100%',
    maxWidth: '300px',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  chatWindow: {
    width: '100%',
    maxWidth: '500px',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  messageList: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto' as 'auto',
    borderBottom: '1px solid #ddd',
  },
  selfMessage: {
    alignSelf: 'flex-end',
    margin: '5px 0',
    padding: '8px',
    backgroundColor: '#d1e7ff',
    borderRadius: '5px',
    maxWidth: '75%',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    margin: '5px 0',
    padding: '8px',
    backgroundColor: '#e1ffc7',
    borderRadius: '5px',
    maxWidth: '75%',
  },
  messageText: {
    display: 'inline-block',
    padding: '5px 10px',
    borderRadius: '4px',
    backgroundColor: '#f0f0f0',
  },
  timestamp: {
    fontSize: '0.8em',
    color: '#888',
    marginLeft: '10px',
  },
  inputArea: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ddd',
  },
  input: {
    flex: 1,
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginRight: '10px',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
