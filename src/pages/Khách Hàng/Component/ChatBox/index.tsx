import React, { useEffect, useRef, useState } from 'react';
import { Bot, Headphones, Send, Sparkles, X } from 'lucide-react';
import { useModel } from 'umi';
import robotImage from '@/assets/Khách Hàng/Chatbot/Chatbot.png';
import { CHAT_SUGGESTIONS } from '@/services/Khách hàng/ChatBox';
import type { ChatMode } from '@/services/Khách hàng/ChatBox';
import './index.less';

const CustomerChatBox: React.FC = () => {
  const {
    isOpen,
    mode,
    messages,
    isSending,
    toggleChat,
    closeChat,
    changeMode,
    sendMessage,
    sendSuggestion,
  } = useModel('Khách Hàng.ChatBox.index');
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [isOpen, isSending, messages]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage(messageText);
    setMessageText('');
  };

  const handleModeChange = (nextMode: ChatMode) => {
    if (mode !== nextMode) {
      changeMode(nextMode);
    }
  };

  return (
    <div className={`customer-chatbox ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <section className="chat-panel" aria-label="Hộp chat hỗ trợ khách hàng">
          <header className="chat-header">
            <div className="chat-title">
              <img src={robotImage} alt="Chatbot" />
              <div>
                <strong>Trợ lý căng tin</strong>
                <span>Trò chuyện cùng mimi & liên hệ admin</span>
              </div>
            </div>
            <button onClick={closeChat} aria-label="Đóng chat">
              <X size={20} />
            </button>
          </header>

          <div className="chat-mode-tabs">
            <button
              className={mode === 'ai' ? 'active' : ''}
              onClick={() => handleModeChange('ai')}
            >
              <Sparkles size={16} />
              Trò chuyện cùng mimi
            </button>
            <button
              className={mode === 'admin' ? 'active' : ''}
              onClick={() => handleModeChange('admin')}
            >
              <Headphones size={16} />
              Admin
            </button>
          </div>

          <div className="chat-messages">
            {messages.map(message => (
              <div key={message.id} className={`chat-message ${message.role}`}>
                <p>{message.content}</p>
                <span>{message.time}</span>
              </div>
            ))}
            {isSending && (
              <div className="chat-message bot typing">
                <p>Mimi đang trả lời...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {mode === 'ai' && (
            <div className="chat-suggestions">
              {CHAT_SUGGESTIONS.map(suggestion => (
                <button
                  key={suggestion.id}
                  onClick={() => sendSuggestion(suggestion.prompt)}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          )}

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              value={messageText}
              onChange={event => setMessageText(event.target.value)}
              disabled={isSending}
              placeholder={mode === 'ai' ? 'Bạn muốn ăn món gì?' : 'Nhập nội dung cần hỗ trợ...'}
            />
            <button type="submit" aria-label="Gửi tin nhắn" disabled={isSending}>
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      <button
        className="chat-robot-button"
        onClick={toggleChat}
        aria-label={isOpen ? 'Đóng chatbot' : 'Mở chatbot'}
      >
        <span className="chat-pulse" />
        <img src={robotImage} alt="" />
        <span className="chat-badge">
          <Bot size={16} />
        </span>
      </button>
    </div>
  );
};

export default CustomerChatBox;
