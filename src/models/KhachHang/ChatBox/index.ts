import { useCallback, useRef, useState } from 'react';
import { useModel } from 'umi';
import type { ChatMessage } from '@/services/KhachHang/ChatBox';
import {
  EChatMode,
  EChatRole,
  buildLocalChatReply,
  CHAT_WELCOME_MESSAGE,
  sendCustomerChatMessage,
} from '@/services/KhachHang/ChatBox';
import { formatTimeHHMM } from '@/utils/format';

const normalizeText = (value = '') => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd');

const DRINK_KEYWORDS = [
  'do uong',
  'nuoc',
  'tra',
  'cafe',
  'ca phe',
  'sinh to',
  'nuoc ep',
  'drink',
];

const PAYMENT_KEYWORDS = [
  'thanh toan',
  'tra tien',
  'tien mat',
  'chuyen khoan',
  'qr',
  'bank',
  'ngan hang',
  'phuong thuc',
];

const isDrinkQuestion = (message: string) => {
  const normalized = normalizeText(message);
  return DRINK_KEYWORDS.some(keyword => normalized.includes(keyword));
};

const isPaymentQuestion = (message: string) => {
  const normalized = normalizeText(message);
  return PAYMENT_KEYWORDS.some(keyword => normalized.includes(keyword));
};

const isShortAffirmation = (message: string) => {
  const normalized = normalizeText(message).trim();
  return ['co', 'ok', 'oke', 'uh', 'u', 'yes', 'duoc', 'lay'].includes(normalized);
};

const isAddIntent = (message: string) => {
  const normalized = normalizeText(message);
  return [
    'them',
    'lay',
    'mua',
    'dat',
    'bo vao gio',
    'cho vao gio',
    'cho minh',
  ].some(keyword => normalized.includes(keyword));
};

const getDishName = (dish: any) => dish?.name || dish?.ten || 'Món ăn';

const getDishPrice = (dish: any) => {
  const price = Number(dish?.price || dish?.gia || dish?.giaBan || 0);
  return price ? `${price.toLocaleString('vi-VN')}đ` : '';
};

const getAvailableDishes = (dishes: any[] = []) => dishes.filter((dish: any) => !dish.hethang);

const sortSuggestedDishes = (dishes: any[] = []) => [...dishes].sort((a: any, b: any) => {
  const soldDiff = Number(b.sold || b.soluongdaban || 0) - Number(a.sold || a.soluongdaban || 0);
  if (soldDiff !== 0) return soldDiff;
  return Number(b.rating || b.danhGia || 0) - Number(a.rating || a.danhGia || 0);
});

const findDishFromMessage = (message: string, dishes: any[] = [], fallbackDishId?: string) => {
  const normalized = normalizeText(message);
  const explicitDish = dishes.find((dish: any) => {
    const name = normalizeText(getDishName(dish));
    return name && normalized.includes(name);
  });
  if (explicitDish) return explicitDish;

  if (fallbackDishId) {
    const fallbackDish = dishes.find((dish: any) => dish.id === fallbackDishId);
    if (fallbackDish) return fallbackDish;
  }

  return dishes.length === 1 ? dishes[0] : undefined;
};

const isFoodSuggestionPrompt = (message?: string) => {
  const normalized = normalizeText(message || '');
  return normalized.includes('goi y') && normalized.includes('mon an');
};

const isCartConfirmationPrompt = (message?: string) => {
  const normalized = normalizeText(message || '');
  return (normalized.includes('them') && normalized.includes('gio'))
    || (normalized.includes('thu') && normalized.includes('mon'));
};

const getDrinkDishes = (dishes: any[] = [], categories: any[] = []) => {
  const drinkCategoryIds = new Set(
    categories
      .filter((category: any) => {
        const label = normalizeText(category?.label || category?.name || category?.id || '');
        return DRINK_KEYWORDS.some(keyword => label.includes(keyword));
      })
      .map((category: any) => String(category.id))
  );

  return getAvailableDishes(dishes).filter((dish: any) => {
    const categoryId = String(dish.cat || dish.category || '');
    const normalizedCategoryId = normalizeText(categoryId);
    const name = normalizeText(dish.name || dish.ten || '');
    return drinkCategoryIds.has(categoryId)
      || normalizedCategoryId === 'drink'
      || DRINK_KEYWORDS.some(keyword => name.includes(keyword));
  });
};

const buildFoodSuggestionReply = (dishes: any[] = []) => {
  const availableDishes = sortSuggestedDishes(getAvailableDishes(dishes));
  const topDish = availableDishes[0];

  if (!topDish) {
    return {
      reply: 'Hôm nay Mimi chưa thấy món nào đang mở bán rồi 😔. Bạn quay lại sau một chút nhé.',
      recommendedDishId: undefined,
    };
  }

  const topPrice = getDishPrice(topDish);
  const topDesc = topDish.desc || topDish.moTa;
  const topText = `${getDishName(topDish)}${topPrice ? ` - ${topPrice}` : ''}`;
  const otherDishes = availableDishes
    .slice(1, 4)
    .map((dish: any) => getDishName(dish))
    .join(', ');

  const reply = availableDishes.length === 1
    ? `Hôm nay có ${topText}. ${topDesc ? `${topDesc}. ` : ''}Bạn muốn Mimi thêm món này vào giỏ không?`
    : `Mimi gợi ý bạn thử ${topText}. ${otherDishes ? `Ngoài ra còn ${otherDishes}. ` : ''}Bạn muốn Mimi thêm ${getDishName(topDish)} vào giỏ không?`;

  return {
    reply,
    recommendedDishId: topDish.id,
  };
};

const buildDrinkReply = (dishes: any[] = [], categories: any[] = []) => {
  const drinks = sortSuggestedDishes(getDrinkDishes(dishes, categories));

  if (drinks.length === 0) {
    return {
      reply: 'Hôm nay Mimi chưa thấy có đồ uống nào trong thực đơn rồi 😔. Bạn muốn mình gợi ý vài món ăn đang có hôm nay không?',
      recommendedDishId: undefined,
    };
  }

  const drinkText = drinks
    .slice(0, 6)
    .map((dish: any) => {
      const price = Number(dish.price || dish.gia || dish.giaBan || 0);
      const priceText = price ? ` - ${price.toLocaleString('vi-VN')}đ` : '';
      return `${dish.name || dish.ten}${priceText}`;
    })
    .join(', ');

  return {
    reply: `Hôm nay có ${drinkText}. Bạn muốn Mimi thêm món nào vào giỏ không?`,
    recommendedDishId: drinks[0]?.id,
  };
};

const buildPaymentReply = () => (
  'Bạn có thể thanh toán bằng 2 phương thức: Tiền mặt khi nhận món hoặc QR/Bank bằng mã QR ngân hàng. Nếu chọn QR/Bank, bạn quét mã sau khi đặt đơn và admin sẽ xác nhận thanh toán. Bạn muốn Mimi hỗ trợ chọn thêm món trước khi thanh toán không?'
);

const buildAddedDishReply = (dish: any) => (
  `Cảm ơn bạn đã chọn ${getDishName(dish)}. Mimi đã thêm món vào giỏ rồi nha. Bạn muốn Mimi gợi ý thêm đồ uống hoặc món ăn kèm cho trọn bữa không?`
);

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
  const { addToCart, dishes, categories } = useModel('KhachHang.ThucDon.index');
  const localContextRef = useRef<{ recommendedDishId?: string }>({});
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
      const lastBotMessage = [...messages].reverse().find(message => message.role === EChatRole.BOT);
      const availableDishes = getAvailableDishes(dishes || []);

      if (isAddIntent(cleanContent)) {
        const dish = findDishFromMessage(cleanContent, availableDishes, localContextRef.current.recommendedDishId);
        if (dish) {
          addToCart(dish, 1);
          localContextRef.current.recommendedDishId = dish.id;
          const responseMessage = createMessage(
            EChatRole.BOT,
            buildAddedDishReply(dish)
          );
          setMessages(prev => [...prev, responseMessage]);
          return;
        }

        const responseMessage = createMessage(
          EChatRole.BOT,
          'Mimi chưa rõ bạn muốn thêm món nào. Bạn nhắn tên món cụ thể giúp mình nhé.'
        );
        setMessages(prev => [...prev, responseMessage]);
        return;
      }

      if (
        isShortAffirmation(cleanContent)
        && lastBotMessage
        && isCartConfirmationPrompt(lastBotMessage.content)
      ) {
        const dish = findDishFromMessage(cleanContent, availableDishes, localContextRef.current.recommendedDishId);
        if (dish) {
          addToCart(dish, 1);
          const responseMessage = createMessage(
            EChatRole.BOT,
            buildAddedDishReply(dish)
          );
          setMessages(prev => [...prev, responseMessage]);
          return;
        }
      }

      if (isShortAffirmation(cleanContent) && lastBotMessage && isFoodSuggestionPrompt(lastBotMessage.content)) {
        const foodSuggestion = buildFoodSuggestionReply(availableDishes);
        localContextRef.current.recommendedDishId = foodSuggestion.recommendedDishId;
        const responseMessage = createMessage(EChatRole.BOT, foodSuggestion.reply);
        setMessages(prev => [...prev, responseMessage]);
        return;
      }

      if (isDrinkQuestion(cleanContent)) {
        const drinkReply = buildDrinkReply(availableDishes, categories || []);
        localContextRef.current.recommendedDishId = drinkReply.recommendedDishId;
        const responseMessage = createMessage(EChatRole.BOT, drinkReply.reply);
        setMessages(prev => [...prev, responseMessage]);
        return;
      }

      if (isPaymentQuestion(cleanContent)) {
        const responseMessage = createMessage(EChatRole.BOT, buildPaymentReply());
        setMessages(prev => [...prev, responseMessage]);
        return;
      }

      const response = await sendCustomerChatMessage(cleanContent, EChatMode.AI, messages, dishes || []);
      if (response.action?.type === 'ADD_TO_CART') {
        const dish = (dishes || []).find((d: any) => d.id === response.action!.dishId);
        if (dish) {
          addToCart(dish, response.action!.qty);
          response.reply = buildAddedDishReply(dish);
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
  }, [messages, dishes, categories, addToCart]);

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
