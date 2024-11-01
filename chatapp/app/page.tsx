// app/page.tsx

import React, { useState } from 'react';

export default function ChatPage() {
  // メッセージの状態を保持するためのstate
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  // メッセージ送信処理
  const sendMessage = () => {
    if (input.trim() !== '') {
      // 新しいメッセージをmessages配列に追加
      setMessages([...messages, input]);
      setInput('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatWindow}>
        {/* メッセージ一覧表示 */}
        <div style={styles.messageList}>
          {messages.map((message, index) => (
            <div key={index} style={styles.message}>
              {message}
            </div>
          ))}
        </div>
        {/* メッセージ入力エリア */}
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

// スタイル定義
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#fff',
  },
  messageList: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto' as 'auto',
    borderBottom: '1px solid #ddd',
  },
  message: {
    margin: '5px 0',
    padding: '8px',
    backgroundColor: '#e1ffc7',
    borderRadius: '5px',
  },
  inputArea: {
    display: 'flex',
    padding: '10px',
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

