import { useCallback, useState } from 'react';
import { useModel } from 'umi';
import type { ChatMessage } from '@/services/Khách hàng/ChatBox';
import {
  EChatMode,
  EChatRole,
  buildLocalChatReply,
  CHAT_WELCOME_MESSAGE,
  sendCustomerChatMessage,
} from '@/services/Khách hàng/ChatBox';
import { formatTimeHHMM } from '@/utils/format';

const createMessage = (
  role: ChatMessage['role'],
  content: string,
): ChatMessage => ({
  id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  time: formatTimeHHMM(),
});
export default function useCustomerChatBoxModel() {
  const { addToCart, dishes } = useModel('Khách Hàng.Thực đơn.index');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([CHAT_WELCOME_MESSAGE]);
  const [isSending, setIsSending] = useState(false);
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);
  const sendMessage = useCallback(async (content: string) => {
    const cleanContent = content.trim();
    if (!cleanContent) return;
    // hiện thị tin nhắn ng dùng
    const userMessage = createMessage(EChatRole.USER, cleanContent);
    setMessages(prev => [...prev, userMessage]);

    setIsSending(true);
    // add món ăn giỏ hàng
    try {
      const response = await sendCustomerChatMessage(cleanContent, EChatMode.AI, messages, dishes || []);
      if (response.action?.type === 'ADD_TO_CART') {
        const dish = (dishes || []).find((d: any) => d.id === response.action!.dishId);
        if (dish) {
          addToCart(dish, response.action!.qty);
        }
      }
      // hiện thi câu trả lời c
      const responseMessage = createMessage(EChatRole.BOT, response.reply);
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      // báo lỗi
      const fallbackMessage = createMessage(
        EChatRole.BOT,
        error instanceof Error ? error.message : buildLocalChatReply(cleanContent)
      );

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsSending(false);
    }
  }, [messages, dishes, addToCart]);

  const sendSuggestion = useCallback((prompt: string) => {
    sendMessage(prompt);
  }, [sendMessage]);

  return {
    isOpen,
    messages,
    isSending,
    setIsOpen,
    toggleChat,
    closeChat,
    sendMessage,
    sendSuggestion,
  };
}
