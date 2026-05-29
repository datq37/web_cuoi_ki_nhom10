import { SEED_VOUCHERS } from '@/services/Khách hàng/Giỏ hàng/cartoption';
import { SEED_MENU } from '@/services/Khách hàng/Thực đơn';
import type {
  ChatContextDish,
  ChatContextVoucher,
  ChatMessage,
  ChatSuggestion,
  CustomerChatRequest,
  CustomerChatResponse,
} from './typing';

export const CHAT_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  content: 'Xin chào, mình là Mimi. Bạn cứ nhắn tự nhiên nhé, Mimi có thể trò chuyện, tư vấn món ăn, xem ưu đãi hoặc kết nối admin cho bạn.',
  time: 'Bây giờ',
};

export const ADMIN_WELCOME_MESSAGE: ChatMessage = {
  id: 'admin-welcome',
  role: 'admin',
  content: 'Kênh liên hệ admin đã sẵn sàng. Bạn hãy mô tả vấn đề cần hỗ trợ nhé.',
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

// Nhận dish từ live model state thay vì dùng SEED_MENU tĩnh
const buildDishContext = (liveDishes?: any[]): ChatContextDish[] => {
  const source = liveDishes && liveDishes.length > 0 ? liveDishes : SEED_MENU;
  return source.map((dish: any) => ({
    id: dish.id,
    name: dish.name || dish.ten,
    price: dish.price || dish.giaBan,
    desc: dish.desc || dish.moTa || '',
    category: dish.cat || dish.category || 'main',
    tags: dish.tags || [],
    rating: dish.rating || dish.danhGia,
    sold: dish.sold,
    kcal: dish.kcal || dish.calo,
  }));
};

const buildVoucherContext = (): ChatContextVoucher[] => (
  SEED_VOUCHERS.map(voucher => ({
    code: voucher.code,
    desc: voucher.desc,
    discount: voucher.discount,
    minOrder: voucher.minOrder,
    expire: voucher.expire,
  }))
);

const buildChatHistory = (messages: ChatMessage[] = []) => messages
  .filter(message => message.id !== CHAT_WELCOME_MESSAGE.id)
  .slice(-8)
  .map(message => ({
    role: message.role,
    content: message.content,
  }));

export const buildLocalChatReply = (_message?: string): string => (
  'Mimi chưa kết nối được Gemini nên không thể tự trả lời lúc này. Bạn kiểm tra lại API key, mạng hoặc quota Gemini rồi thử lại.'
);

export const sendCustomerChatMessage = async (
  message: string,
  mode: CustomerChatRequest['mode'],
  messages: ChatMessage[] = [],
  liveDishes?: any[],  // Live dishes từ model (có đúng ID)
): Promise<CustomerChatResponse> => {
  const payload: CustomerChatRequest = {
    message,
    mode,
    history: buildChatHistory(messages),
    dishes: buildDishContext(liveDishes),
    vouchers: buildVoucherContext(),
  };

  const response = await fetch('/api/customer/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJsonResponse = contentType.includes('application/json');

  if (!isJsonResponse) {
    throw new Error(
      'API /api/customer/chat chưa trả JSON. Bạn đang chạy dev server không bật mock, hãy chạy npm start hoặc bật lại mock API.',
    );
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.reply || 'Không thể kết nối Gemini');
  }

  return response.json();
};

export type {
  ChatMessage,
  ChatMode,
  ChatSuggestion,
  CustomerChatRequest,
  CustomerChatResponse,
} from './typing';
