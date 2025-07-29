import React, { useState, useEffect, useRef } from 'react';
import './Talktalk.css';

const categories = ['General', 'Guides', 'FanArt', 'Events'];

const TalkTalk = () => {
  const [activeCategory, setActiveCategory] = useState('General');
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('Guest');
  const [recentMessages, setRecentMessages] = useState([]); // record recently sent messages
  const [editingMessage, setEditingMessage] = useState(null); // track which message is being edited
  const [editInput, setEditInput] = useState(''); // input for editing message
  const [messageCount, setMessageCount] = useState({}); // track message count for each category
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
        setMessageCount(prev => ({
          ...prev,
          [activeCategory]: data.length
        }));
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };
    fetchMessages();
  }, [activeCategory]);

  // Real-time database update check - check for message changes every 2 seconds
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const res = await fetch(`/messages?section=${activeCategory}`);

        if (!res.ok) {
          const text = await res.text(); // ← 응답이 JSON이 아닐 경우 대비
          throw new Error(`Unexpected response: ${text}`);
        }

        const data = await res.json();
        const currentMessages = messages[activeCategory] || [];
        const currentCount = messageCount[activeCategory] || 0;

        // Check if message count changed (new/deleted messages)
        const countChanged = data.length !== currentCount;

        // Check if message content changed (edited messages)
        let contentChanged = false;
        if (data.length === currentMessages.length && data.length > 0) {
          // Create maps for efficient comparison by message ID
          const currentMessagesMap = new Map(currentMessages.map(msg => [msg._id, msg]));

          // Check if any message content has changed
          contentChanged = data.some(newMsg => {
            const oldMsg = currentMessagesMap.get(newMsg._id);
            return oldMsg && newMsg.message !== oldMsg.message;
          });
        }

        // Update interface if count or content changed
        if (countChanged || contentChanged) {
          setMessages(prev => ({
            ...prev,
            [activeCategory]: data
          }));
          setMessageCount(prev => ({
            ...prev,
            [activeCategory]: data.length
          }));
        }
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    };

    const interval = setInterval(checkForUpdates, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, [activeCategory, messageCount]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const user = localStorage.getItem('user');
    const userName = user ? JSON.parse(user).name : 'Guest';
    console.log(userName);
    const newMessage = {
      section: activeCategory,
      message: input,
      sender: userName   // Added sender field
    };

    try {
      const res = await fetch('/messages', {
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

        // Record the recent message, remove it after 1 minute
        setRecentMessages(prev => [...prev, saved._id]);
        setTimeout(() => {
          setRecentMessages(prev => prev.filter(id => id !== saved._id));
        }, 1 * 60 * 1000); // 1 minute

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

  // remove message
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    const user = localStorage.getItem('user');
    const userName = user ? JSON.parse(user).name : 'Guest';

    try {
      const res = await fetch(`/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sender: userName })
      });

      if (res.ok) {
        // Remove message from the current category
        setMessages(prev => ({
          ...prev,
          [activeCategory]: prev[activeCategory].filter(msg => msg._id !== messageId)
        }));

        // Remove from recent messages
        setRecentMessages(prev => prev.filter(id => id !== messageId));

        alert('Message deleted successfully!');
      } else {
        const errorData = await res.json();
        alert('Failed to delete message: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to delete message. Please try again later.');
    }
  };

  // edit message
  const handleEditMessage = async (messageId) => {
    if (!editInput.trim()) {
      alert('Message cannot be empty');
      return;
    }

    const user = localStorage.getItem('user');
    const userName = user ? JSON.parse(user).name : 'Guest';

    try {
      const res = await fetch(`/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          sender: userName,
          message: editInput
        })
      });

      if (res.ok) {
        const updatedMessage = await res.json();
        // Update the message in current category
        setMessages(prev => ({
          ...prev,
          [activeCategory]: prev[activeCategory].map(msg =>
            msg._id === messageId ? updatedMessage : msg
          )
        }));

        // Exit edit mode
        setEditingMessage(null);
        setEditInput('');

        alert('Message edited successfully!');
      } else {
        const errorData = await res.json();
        alert('Failed to edit message: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error editing message:', err);
      alert('Failed to edit message. Please try again later.');
    }
  };

  // start editing a message
  const startEditMessage = (message) => {
    setEditingMessage(message._id);
    setEditInput(message.message);
  };

  // cancel editing
  const cancelEdit = () => {
    setEditingMessage(null);
    setEditInput('');
  };

  // check if the message can be edited (same time limit as delete - 1 minute)
  const canEditMessage = (message) => {
    const user = localStorage.getItem('user');
    const userName = user ? JSON.parse(user).name : 'Guest';

    // Only the sender can edit their own messages
    if (message.sender !== userName) return false;

    // Only messages in recentMessages can be edited
    if (!recentMessages.includes(message._id)) return false;

    // Check if within 1 minute
    const messageTime = new Date(message.timestamp);
    const currentTime = new Date();
    const timeDifference = currentTime - messageTime;
    const oneMinute = 1 * 60 * 1000;

    return timeDifference <= oneMinute;
  };

  // check if the message can be deleted
  const canDeleteMessage = (message) => {
    const user = localStorage.getItem('user');
    const userName = user ? JSON.parse(user).name : 'Guest';

    // Only the sender can delete their own messages
    if (message.sender !== userName) return false;

    // Only messages in recentMessages can be deleted
    if (!recentMessages.includes(message._id)) return false;

    // Check if within 1 minute
    const messageTime = new Date(message.timestamp);
    const currentTime = new Date();
    const timeDifference = currentTime - messageTime;
    const oneMinute = 1 * 60 * 1000;

    return timeDifference <= oneMinute;
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
          {/* Real-time update indicator */}
          <div className="live-indicator">
            <div className="live-dot"></div>
            LIVE
          </div>
          <div className="chat-messages">
            {(messages[activeCategory] || []).map((msg, idx) => (
              <div key={idx} className="message-card">
                {editingMessage === msg._id ? (
                  // Edit mode
                  <>
                    <strong className="username">{msg.sender}</strong>:
                    <input
                      type="text"
                      value={editInput}
                      onChange={e => setEditInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleEditMessage(msg._id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="inline-edit-input"
                      autoFocus
                    />
                    <div className="timestamp">{formatTimestamp(msg.timestamp)}</div>
                    <button
                      onClick={() => handleEditMessage(msg._id)}
                      className="save-edit-button"
                      title="Save changes (Enter)"
                    >
                      ✓
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="cancel-edit-button"
                      title="Cancel editing (Esc)"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  // Display mode
                  <>
                    <strong className="username">{msg.sender}</strong>: {msg.message}
                    <div className="timestamp">{formatTimestamp(msg.timestamp)}</div>
                    {/* Edit button - positioned left of delete button */}
                    {canEditMessage(msg) && (
                      <button
                        className="edit-button"
                        onClick={() => startEditMessage(msg)}
                        title="Edit message (within 1 minute)"
                      >
                        ✏️
                      </button>
                    )}
                    {/* Delete button - maintains original position */}
                    {canDeleteMessage(msg) && (
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteMessage(msg._id)}
                        title="Delete message (within 1 minute)"
                      >
                        &#10006;
                      </button>
                    )}
                  </>
                )}
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