import { SEED_VOUCHERS } from '@/services/Khách hàng/Giỏ hàng/cartoption';
import { SEED_MENU } from '@/services/Khách hàng/Thực đơn';
import type {
  ChatContextDish,
  ChatContextVoucher,
  ChatMessage,
  CustomerChatRequest,
  CustomerChatResponse,
} from './typing';

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

const buildChatHistory = (messages: ChatMessage[] = [], welcomeMessageId: string) => messages
  .filter(message => message.id !== welcomeMessageId)
  .slice(-8)
  .map(message => ({
    role: message.role,
    content: message.content,
  }));

export const sendCustomerChatMessage = async (
  message: string,
  mode: CustomerChatRequest['mode'],
  messages: ChatMessage[] = [],
  liveDishes?: any[],
  welcomeMessageId: string = 'welcome'
): Promise<CustomerChatResponse> => {
  const payload: CustomerChatRequest = {
    message,
    mode,
    history: buildChatHistory(messages, welcomeMessageId),
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
