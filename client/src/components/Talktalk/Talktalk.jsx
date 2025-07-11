import React, { useState, useEffect } from 'react';
import './TalkTalk.css';

const categories = ['General', 'Guides', 'FanArt', 'Events'];

const TalkTalk = () => {
  const [activeCategory, setActiveCategory] = useState('General');
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('pokeMessages');
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pokeMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      username: 'User',
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => ({
      ...prev,
      [activeCategory]: [...(prev[activeCategory] || []), newMessage],
    }));
    setInput('');
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">
        <img src="/images/pokeball.png" alt="logo" className="chat-logo" />
        PokéChat Forums
      </h2>

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
                <strong className="username">{msg.username}</strong>: {msg.text}
                <div className="timestamp">{msg.timestamp}</div>
              </div>
            ))}
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