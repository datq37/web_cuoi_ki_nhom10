import {
  EChatRole,
  type ChatMessage,
  type ChatSuggestion,
} from './typing';

export const CHAT_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: EChatRole.BOT,
  content: 'Xin chào, mình là Mimi. Bạn cứ nhắn tự nhiên nhé, Mimi có thể trò chuyện, tư vấn món ăn, xem ưu đãi hoặc kết nối admin cho bạn.',
  time: 'Bây giờ',
};

export const CHAT_SUGGESTIONS: ChatSuggestion[] = [
  {
    id: 'healthy',
    label: 'Món nhẹ, lành mạnh',
    prompt: 'Tư vấn cho tôi món ăn nhẹ và lành mạnh hôm nay.',
  },
  {
    id: 'budget',
    label: 'Món dưới 50.000đ',
    prompt: 'Gợi ý món ngon dưới 50.000đ.',
  },
  {
    id: 'popular',
    label: 'Món bán chạy',
    prompt: 'Hôm nay món nào đáng thử nhất?',
  },
];

export const buildLocalChatReply = (_message?: string): string => (
  'Mimi chưa kết nối được Gemini nên không thể tự trả lời lúc này. Bạn kiểm tra lại API key, mạng hoặc quota Gemini rồi thử lại.'
);

export * from './api';
export type {
  ChatMessage,
  ChatSuggestion,
  CustomerChatRequest,
  CustomerChatResponse,
} from './typing';
export { EChatMode, EChatRole, EChatProvider } from './typing';
