export enum EChatMode {
  AI = 'ai',
  ADMIN = 'admin',
}

export enum EChatRole {
  BOT = 'bot',
  USER = 'user',
  ADMIN = 'admin',
}

export interface ChatMessage {
  id: string;
  role: EChatRole;
  content: string;
  time: string;
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
  mode: EChatMode;
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

export enum EChatProvider {
  GEMINI = 'gemini',
  LOCAL = 'local',
}

export interface CustomerChatResponse {
  reply: string;
  provider: EChatProvider;
  action?: ChatAction; // Hành động kèm theo (nếu có)
}
