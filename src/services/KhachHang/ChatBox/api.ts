import { SEED_VOUCHERS } from '@/services/KhachHang/Giỏ hàng/cartoption';
import { SEED_MENU } from '@/services/KhachHang/ThucDon';
import type {
  ChatContextDish,
  ChatContextVoucher,
  ChatMessage,
  CustomerChatRequest,
  CustomerChatResponse,
} from './typing';
import { EChatProvider } from './typing';

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

const normalizeText = (value = '') => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd');

const formatPrice = (value?: number) => {
  const price = Number(value || 0);
  return price ? `${price.toLocaleString('vi-VN')}đ` : '';
};

const getAvailableDishes = (dishes: ChatContextDish[] = []) => dishes.filter(dish => dish && dish.name);

const buildDishText = (dish: ChatContextDish) => {
  const price = formatPrice(dish.price);
  return `${dish.name}${price ? ` - ${price}` : ''}`;
};

const buildLocalResponse = (payload: CustomerChatRequest): CustomerChatResponse => {
  const message = normalizeText(payload.message);
  const dishes = getAvailableDishes(payload.dishes);
  const vouchers = payload.vouchers || [];

  if (payload.mode === 'admin') {
    return {
      provider: EChatProvider.LOCAL,
      reply: 'Mimi đã ghi nhận tin nhắn của bạn. Admin sẽ kiểm tra và phản hồi sớm nhé.',
    };
  }

  if (message.includes('uu dai') || message.includes('voucher') || message.includes('khuyen mai')) {
    if (!vouchers.length) {
      return {
        provider: EChatProvider.LOCAL,
        reply: 'Hôm nay Mimi chưa thấy ưu đãi nào đang áp dụng rồi. Bạn xem thực đơn trước nhé.',
      };
    }

    const voucherText = vouchers
      .slice(0, 3)
      .map(voucher => `${voucher.code}: ${voucher.desc}`)
      .join('; ');

    return {
      provider: EChatProvider.LOCAL,
      reply: `Mimi thấy có các ưu đãi này: ${voucherText}. Bạn muốn xem món phù hợp không?`,
    };
  }

  const budgetMatch = message.match(/(?:duoi|nho hon|tam)\s*(\d{2,3})(?:k|\.000|000)?/);
  if (budgetMatch) {
    const budget = Number(budgetMatch[1]) * 1000;
    const matched = dishes
      .filter(dish => Number(dish.price || 0) > 0 && Number(dish.price || 0) <= budget)
      .sort((a, b) => Number(b.sold || 0) - Number(a.sold || 0))
      .slice(0, 4);

    if (matched.length) {
      return {
        provider: EChatProvider.LOCAL,
        reply: `Dưới ${budget.toLocaleString('vi-VN')}đ thì Mimi gợi ý ${matched.map(buildDishText).join(', ')}.`,
      };
    }
  }

  const topDishes = [...dishes]
    .sort((a, b) => {
      const soldDiff = Number(b.sold || 0) - Number(a.sold || 0);
      if (soldDiff !== 0) return soldDiff;
      return Number(b.rating || 0) - Number(a.rating || 0);
    })
    .slice(0, 3);

  if (topDishes.length) {
    return {
      provider: EChatProvider.LOCAL,
      reply: `Mimi gợi ý bạn thử ${topDishes.map(buildDishText).join(', ')}. Bạn muốn Mimi thêm món nào vào giỏ không?`,
    };
  }

  return {
    provider: EChatProvider.LOCAL,
    reply: 'Mimi chưa thấy dữ liệu thực đơn hôm nay. Bạn thử tải lại trang hoặc quay lại sau một chút nhé.',
  };
};

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

  let response: Response;
  try {
    response = await fetch('/api/customer/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return buildLocalResponse(payload);
  }

  const contentType = response.headers.get('content-type') || '';
  const isJsonResponse = contentType.includes('application/json');

  if (!isJsonResponse) {
    return buildLocalResponse(payload);
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    if (errorBody?.reply) {
      return {
        provider: EChatProvider.LOCAL,
        reply: errorBody.reply,
      };
    }
    return buildLocalResponse(payload);
  }

  return response.json();
};
