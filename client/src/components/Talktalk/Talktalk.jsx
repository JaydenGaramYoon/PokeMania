import React, { useState, useEffect, useRef } from 'react';
import './TalkTalk.css';

const categories = ['General', 'Guides', 'FanArt', 'Events'];

const TalkTalk = () => {
  const [activeCategory, setActiveCategory] = useState('General');
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('Guest');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date)) return '';
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const user = localStorage.getItem('user');
        const userName = user ? JSON.parse(user).name : 'Guest';
        console.log('Current user:', userName);
        // const res = await fetch('/api/users/me', {
        //   credentials: 'include'
        // });
        // if (res.ok) {
        //   const user = await res.json();
          setUsername(userName || 'Guest');
        }
      catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?section=${activeCategory}`);
        const data = await res.json();
        setMessages(prev => ({
          ...prev,
          [activeCategory]: data
        }));
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };
    fetchMessages();
  }, [activeCategory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessage = {
      section: activeCategory,
      message: input
    };
    
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newMessage)
      });
      
      if (res.ok) {
        const saved = await res.json();
        setMessages(prev => ({
          ...prev,
          [activeCategory]: [...(prev[activeCategory] || []), saved]
        }));
        setInput('');
      } else {
        const errorData = await res.json();
        console.error('Failed to send message:', errorData);
        alert('Fail to send information: ' + (errorData.error || 'unknown error'));
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">
        <img src="/images/pokeball.png" alt="logo" className="chat-logo" />
        PokéChat Forums
      </h2>
      <div className="chat-user">Logged in as: <strong>{username}</strong></div>
      <div className="category-tabs">
        {categories.map((cat, index) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
          >
            <img src={`/images/forum${index + 1}.png`} alt={`${cat} icon`} className="category-icon" />
            {cat}
          </button>
        ))}
      </div>
      <div className="chat-body">
        <div className="chat-window">
          <div className="chat-messages">
            {(messages[activeCategory] || []).map((msg, idx) => (
              <div key={idx} className="message-card">
                <strong className="username">{msg.sender}</strong>: {msg.message}
                <div className="timestamp">{formatTimestamp(msg.timestamp)}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
        <div className="chat-input-area">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={`Message in ${activeCategory} forum...`}
            className="chat-input"
          />
          <button onClick={handleSend} className="send-button">Send</button>
        </div>
      </div>
    </div>
  );
};

export default TalkTalk;