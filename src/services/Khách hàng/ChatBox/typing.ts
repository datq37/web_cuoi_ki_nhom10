export type ChatMode = 'ai' | 'admin';

export interface ChatMessage {
  id: string;
  role: 'bot' | 'user' | 'admin';
  content: string;
  time: string;
  image?: string;
}

export interface ChatSuggestion {
  id: string;
  label: string;
  prompt: string;
}

export interface ChatContextDish {
  id: string;        // ID để frontend biết thêm món nào vào giỏ
  name: string;
  price: number;
  desc: string;
  category: string;
  tags?: string[];
  rating?: number;
  sold?: number;
  kcal?: number;
}

export interface ChatContextVoucher {
  code: string;
  desc: string;
  discount: number;
  minOrder?: number;
  expire?: string;
}

export interface CustomerChatRequest {
  message: string;
  mode: ChatMode;
  history?: Pick<ChatMessage, 'role' | 'content'>[];
  dishes: ChatContextDish[];
  vouchers: ChatContextVoucher[];
}

export interface ChatAction {
  type: 'ADD_TO_CART';
  dishId: string;      // ID của món cần thêm vào giỏ
  dishName: string;    // Tên món (để hiển thị thông báo)
  qty: number;         // Số lượng (mặc định 1)
}

export interface CustomerChatResponse {
  reply: string;
  provider: 'gemini' | 'local';
  action?: ChatAction; // Hành động kèm theo (nếu có)
}
