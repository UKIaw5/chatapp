"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

// Initialize Socket.io client instance
const socket = io("http://localhost:3000", {
  path: "/api/socket",
});

const ChatPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<{ text: string; sender: string; timestamp: string }[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<string[]>([]); // Store list of logged-in users

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/login"); // Redirect to login if no username is found
    } else {
      setUsername(storedUsername);
      socket.emit("user_connected", storedUsername); // Notify server that user connected
    }

    // Listen for messages from server
    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Listen for the updated user list from server
    socket.on("update_user_list", (userList: string[]) => {
      console.log("Received user list on client:", userList); // Log received user list
      setUsers(userList); // Update local user list state
    });

    return () => {
      socket.off("message");
      socket.off("update_user_list");
    };
  }, [router]);

  const sendMessage = () => {
    if (input.trim()) {
      const message = { text: input, sender: username, timestamp: new Date().toLocaleTimeString() };
      socket.emit("message", message);
      setInput('');
    }
  };

  const logout = () => {
    console.log("Emitting user_disconnected for:", username); // Debug log for logout event
    socket.emit("user_disconnected", username); // Notify server of disconnection
    localStorage.removeItem("username");
    router.push("/login");
  };

  return (
    <div style={styles.container}>
      <h1>Welcome, {username}</h1>
      <button onClick={logout} style={styles.button}>Logout</button> {/* Logout Button */}
      
      <div style={styles.userList}>
        <h3>Online Users</h3>
        <ul>
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user}>{user}</li>
            ))
          ) : (
            <li>No users online</li>
          )}
        </ul>
      </div>

      <div style={styles.chatWindow}>
        <h3>Messages</h3>
        <div style={styles.messageList}>
          {messages.map((message, index) => (
            <div key={index} style={message.sender === username ? styles.selfMessage : styles.otherMessage}>
              <span>{message.sender}: {message.text}</span>
              <span style={styles.timestamp}>{message.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          id="messageInput"
          name="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
};

console.log('MongoDB URI:', process.env.MONGODB_URI); // Debugging MONGODB_URI

export default ChatPage;

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
