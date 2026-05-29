import React, { useEffect, useRef, useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { useModel } from 'umi';
import robotImage from '@/assets/Khách Hàng/Chatbot/Chatbot.png';
import { CHAT_SUGGESTIONS } from '@/services/Khách hàng/ChatBox';
import './index.less';

const CustomerChatBox: React.FC = () => {
  const {
    isOpen,
    messages,
    isSending,
    toggleChat,
    closeChat,
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
    if (!messageText.trim()) return;
    sendMessage(messageText);
    setMessageText('');
  };

  return (
    <div className={`hopThoaiKhachHang ${isOpen ? 'mo' : ''}`}>
      {isOpen && (
        <section className="khungThoai" aria-label="Hộp chat hỗ trợ khách hàng">
          <header className="tieuDeThoai">
            <div className="tenThoai">
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


          <div className="danhSachTinNhan">
            {messages.map(message => (
              <div key={message.id} className={`tinNhan ${message.role}`}>

                {message.content && <p>{message.content}</p>}
                <span>{message.time}</span>
              </div>
            ))}
            {isSending && (
              <div className="tinNhan bot dangGo">
                <p>Mimi đang trả lời...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="goiYThoai">
            {CHAT_SUGGESTIONS.map(suggestion => (
              <button
                key={suggestion.id}
                onClick={() => sendSuggestion(suggestion.prompt)}
              >
                {suggestion.label}
              </button>
            ))}
          </div>



          <form className="dongNhapLieu" onSubmit={handleSubmit}>
            <input
              value={messageText}
              onChange={event => setMessageText(event.target.value)}
              disabled={isSending}
              placeholder="Bạn muốn ăn món gì?"
            />
            <button type="submit" aria-label="Gửi tin nhắn" disabled={isSending || !messageText.trim()}>
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      <button
        className="nutRobotThoai"
        onClick={toggleChat}
        aria-label={isOpen ? 'Đóng chatbot' : 'Mở chatbot'}
      >
        <span className="hieuUngToaSang" />
        <img src={robotImage} alt="" />
        <span className="huyHieuThoai">
          <Bot size={16} />
        </span>
      </button>
    </div>
  );
};

export default CustomerChatBox;
