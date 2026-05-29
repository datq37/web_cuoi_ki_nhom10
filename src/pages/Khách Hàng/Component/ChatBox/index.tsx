import React, { useEffect, useRef, useState } from 'react';
import { Bot, Headphones, Send, Sparkles, X, ImagePlus } from 'lucide-react';
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [isOpen, isSending, messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!messageText.trim() && !selectedImage) return;
    sendMessage(messageText, selectedImage || undefined);
    setMessageText('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
                <span>Trò chuyện cùng mimi</span>
              </div>
            </div>
            <button onClick={closeChat} aria-label="Đóng chat">
              <X size={20} />
            </button>
          </header>


          <div className="chat-messages">
            {messages.map(message => (
              <div key={message.id} className={`chat-message ${message.role}`}>
                {message.image && (
                  <img src={message.image} alt="attachment" className="chat-image-attachment" />
                )}
                {message.content && <p>{message.content}</p>}
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

          {selectedImage && (
            <div className="chat-image-preview">
              <img src={selectedImage} alt="preview" />
              <button type="button" onClick={() => {
                setSelectedImage(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}>
                <X size={14} />
              </button>
            </div>
          )}

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              value={messageText}
              onChange={event => setMessageText(event.target.value)}
              disabled={isSending}
              placeholder="Bạn muốn ăn món gì?"
            />
            <button type="submit" aria-label="Gửi tin nhắn" disabled={isSending || (!messageText.trim() && !selectedImage)}>
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
