import { useCallback, useState } from 'react';
import { useModel } from 'umi';
import type { ChatMessage, ChatMode } from '@/services/Khách hàng/ChatBox';
import {
  ADMIN_WELCOME_MESSAGE,
  buildLocalChatReply,
  CHAT_WELCOME_MESSAGE,
  sendCustomerChatMessage,
} from '@/services/Khách hàng/ChatBox';

const getMessageTime = () => new Date().toLocaleTimeString('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
});

const createMessage = (
  role: ChatMessage['role'],
  content: string,
): ChatMessage => ({
  id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  time: getMessageTime(),
});

export default function useCustomerChatBoxModel() {
  const { addToCart, dishes } = useModel('Khách Hàng.Thực đơn.index');
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('ai');
  const [messageGroups, setMessageGroups] = useState<Record<ChatMode, ChatMessage[]>>({
    ai: [CHAT_WELCOME_MESSAGE],
    admin: [ADMIN_WELCOME_MESSAGE],
  });
  const [isSending, setIsSending] = useState(false);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const changeMode = useCallback((nextMode: ChatMode) => {
    setMode(nextMode);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const cleanContent = content.trim();
    if (!cleanContent) return;

    const userMessage = createMessage('user', cleanContent);
    setMessageGroups(prev => ({
      ...prev,
      [mode]: [...prev[mode], userMessage],
    }));

    setIsSending(true);

    try {
      const currentMessages = messageGroups[mode];
      // Truyền live dishes để Gemini nhận đúng ID khớp với model state
      const response = await sendCustomerChatMessage(cleanContent, mode, currentMessages, dishes || []);

      // Xử lý action từ AI (ví dụ: thêm món vào giỏ)
      if (response.action?.type === 'ADD_TO_CART') {
        const dish = (dishes || []).find((d: any) => d.id === response.action!.dishId);
        if (dish) {
          addToCart(dish);
        }
      }

      const responseMessage = createMessage(
        mode === 'ai' ? 'bot' : 'admin',
        response.reply,
      );

      setMessageGroups(prev => ({
        ...prev,
        [mode]: [...prev[mode], responseMessage],
      }));
    } catch (error) {
      const fallbackMessage = createMessage(
        mode === 'ai' ? 'bot' : 'admin',
        mode === 'ai'
          ? (error instanceof Error ? error.message : buildLocalChatReply(cleanContent))
          : 'Tin nhắn đã được ghi nhận. Cần backend admin để phản hồi realtime.',
      );

      setMessageGroups(prev => ({
        ...prev,
        [mode]: [...prev[mode], fallbackMessage],
      }));
    } finally {
      setIsSending(false);
    }
  }, [messageGroups, mode, dishes, addToCart]);

  const sendSuggestion = useCallback((prompt: string) => {
    sendMessage(prompt);
  }, [sendMessage]);

  return {
    isOpen,
    mode,
    messages: messageGroups[mode],
    messageGroups,
    isSending,
    setIsOpen,
    toggleChat,
    closeChat,
    changeMode,
    sendMessage,
    sendSuggestion,
  };
}
