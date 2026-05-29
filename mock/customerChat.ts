// Load .env.local từ thư mục gốc project (mock/../.env.local)
const path = require('path');
const dotenv = require('dotenv');

// Load .env.local trước (ưu tiên cao hơn), rồi .env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Chuyển sang dùng Groq với Llama 3.3 70B
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const MAX_RETRIES = 3;       // Số lần thử lại
const RETRY_DELAY_MS = 2000; // Chờ 2 giây

const getApiKey = (): string | undefined => {
  const key = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY; // Fallback nếu đổi tên biến
  if (key && key.trim()) return key.trim();
  return undefined;
};

// Parse body an toàn: hỗ trợ cả string (chưa parse) và object (đã parse sẵn)
const parseBody = (req: any): any => {
  try {
    if (!req.body) return {};
    if (typeof req.body === 'string') return JSON.parse(req.body);
    return req.body;
  } catch {
    return {};
  }
};

const buildHistoryText = (history: any[] = []) =>
  history
    .slice(-8)
    .map(message => {
      const speaker = message.role === 'user' ? 'Khách hàng' : 'Mimi';
      return `${speaker}: ${message.content}`;
    })
    .join('\n');

const buildErrorReply = (detail?: string) => {
  if (!detail) {
    return 'Mimi chưa kết nối được hệ thống AI nên không thể tự trả lời lúc này. Bạn kiểm tra lại API key hoặc mạng rồi thử lại.';
  }
  return `Lỗi hệ thống AI: ${detail}`;
};

// Tên danh mục tiếng Việt
const CATEGORY_LABEL: Record<string, string> = {
  rice: 'Cơm',
  noodle: 'Bún/Phở/Mỳ',
  veg: 'Chay/Healthy',
  main: 'Món chính',
  snack: 'Ăn vặt',
  drink: 'Đồ uống',
};

const buildPrompt = (body: any) => {
  const dishList: any[] = Array.isArray(body.dishes) ? body.dishes : [];
  const voucherList: any[] = Array.isArray(body.vouchers) ? body.vouchers : [];

  // Tách riêng thức ăn và đồ uống
  const foodList = dishList.filter((d: any) => d.category !== 'drink');
  const drinkList = dishList.filter((d: any) => d.category === 'drink');

  const formatDish = (dish: any) => {
    const cat = CATEGORY_LABEL[dish.category] || dish.category;
    const kcal = dish.kcal ? `${dish.kcal} kcal` : '';
    const rating = dish.rating ? `⭐${dish.rating}` : '';
    const sold = dish.sold ? `bán ${dish.sold}` : '';
    const meta = [cat, kcal, rating, sold].filter(Boolean).join(' | ');
    // Bao gồm ID để Mimi tham chiếu khi cần thêm vào giỏ
    return `• [id:${dish.id}] ${dish.name} — ${dish.price.toLocaleString('vi-VN')}đ (${meta})\n  ${dish.desc}`;
  };

  const foodSection = foodList.length
    ? foodList.map(formatDish).join('\n')
    : 'Hôm nay chưa có dữ liệu thức ăn.';

  const drinkSection = drinkList.length
    ? drinkList.map(formatDish).join('\n')
    : 'Hôm nay chưa có dữ liệu đồ uống.';

  const vouchers = voucherList.length
    ? voucherList.map(
        (v: any) =>
          `• ${v.code}: ${v.desc} — giảm ${v.discount.toLocaleString('vi-VN')}đ, đơn tối thiểu ${(v.minOrder || 0).toLocaleString('vi-VN')}đ`,
      ).join('\n')
    : 'Hôm nay không có ưu đãi.';

  const history = buildHistoryText(Array.isArray(body.history) ? body.history : []);

  console.log(`[MIMI] foods: ${foodList.length}, drinks: ${drinkList.length}, vouchers: ${voucherList.length}, msg: "${body.message}"`);

  return [
    '=== VAI TRÒ ===',
    'Bạn là Mimi, trợ lý AI của căng tin doanh nghiệp. Nhiệm vụ: tư vấn món ăn, đồ uống, ưu đãi cho khách.',
    '',
    '=== CÁCH TRẢ LỜI ===',
    '- Tự nhiên, thân thiện, ngắn gọn như đang nhắn tin.',
    '- Khi khách hỏi về THỨC ĂN (cơm, bún, phở, món chính, ăn vặt...): chỉ gợi ý từ mục THỨC ĂN HÔM NAY bên dưới.',
    '- Khi khách hỏi về ĐỒ UỐNG (nước, trà, cà phê, sinh tố...): chỉ gợi ý từ mục ĐỒ UỐNG HÔM NAY bên dưới.',
    '- Luôn nêu rõ: tên món, giá, calo (nếu có), lý do phù hợp với câu hỏi.',
    '- Nếu gợi ý nhiều món, dùng danh sách gạch đầu dòng.',
    '- KHÔNG bịa món ngoài danh sách. KHÔNG trộn lẫn thức ăn và đồ uống trừ khi khách hỏi cả hai.',
    '- Khi khách hỏi ưu đãi/voucher: nêu từ mục ƯU ĐÃI.',
    '- TƯ VẤN & HỎI Ý KIẾN: Khi gợi ý món, LUÔN chủ động hỏi khách có muốn thêm vào đơn không (ví dụ: "Bạn có muốn mình thêm món này vào đơn không?").',
    '- THÊM VÀO GIỎ HÀNG: CHỈ KHI khách xác nhận ĐỒNG Ý ("có", "thêm", "ok", "được"...) thì bạn mới thêm dòng: [ACTION:ADD_TO_CART:dishId] (với dishId là id của món đó). TUYỆT ĐỐI KHÔNG tự động thêm khi khách chỉ mới hỏi thông tin.',
    '- HỖ TRỢ CHUNG: Trả lời các câu hỏi về thanh toán, nhận món, giờ giấc... dựa trên mục THÔNG TIN CĂNG TIN.',
    '',
    '=== THÔNG TIN CĂNG TIN ===',
    '- Thanh toán: Hỗ trợ tiền mặt (Cash) và Chuyển khoản (QR / Bank transfer).',
    '- Cách thức: Khách đặt món trên web, thanh toán, rồi nhận món tại quầy căng tin.',
    '- Thời gian chuẩn bị: Trung bình 10-15 phút tùy món.',
    '',
    '=== LỊCH SỬ HỘI THOẠI ===',
    history || '(Chưa có tin nhắn trước.)',
    '',
    '=== THỨC ĂN HÔM NAY ===',
    foodSection,
    '',
    '=== ĐỒ UỐNG HÔM NAY ===',
    drinkSection,
    '',
    '=== ƯU ĐÃI HÔM NAY ===',
    vouchers,
    '',
    '=== CÂU HỎI KHÁCH ===',
    body.message,
  ].join('\n');
};


export default {
  'POST /api/customer/chat': async (req: any, res: any) => {
    const apiKey = getApiKey();
    const body = parseBody(req);

    if (body.mode === 'admin') {
      res.json({
        provider: 'local',
        reply: 'Tin nhắn đã được chuyển tới kênh admin. Admin sẽ phản hồi bạn sớm nhất.',
      });
      return;
    }

    if (!apiKey) {
      res.status(503).json({
        provider: 'local',
        reply: buildErrorReply('Chưa có GROQ_API_KEY trong .env.local.'),
      });
      return;
    }

    const axios = require('axios');
    const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    
    // Định dạng payload chuẩn OpenAI tương thích với Groq
    const payload = {
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: buildPrompt(body) }],
      temperature: 0.7,
      max_tokens: 1024,
    };

    let lastError: any = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[MIMI] Lần thử ${attempt}/${MAX_RETRIES} — model: ${GROQ_MODEL}`);
        const response = await axios.post(endpoint, payload, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        });

        const rawReply = response.data?.choices?.[0]?.message?.content;
        if (!rawReply) {
          res.status(502).json({
            provider: 'local',
            reply: buildErrorReply('AI không trả về nội dung.'),
          });
          return;
        }

        // Tách action [ACTION:ADD_TO_CART:dishId]
        const actionMatch = rawReply.match(/\[ACTION:ADD_TO_CART:([^\]]+)\]/);
        const reply = rawReply.replace(/\[ACTION:ADD_TO_CART:[^\]]+\]/g, '').trim();

        let action = undefined;
        if (actionMatch) {
          const dishId = actionMatch[1].trim();
          const dish = (body.dishes || []).find((d: any) => d.id === dishId);
          if (dish) {
            action = { type: 'ADD_TO_CART', dishId, dishName: dish.name, qty: 1 };
            console.log(`[MIMI] 🛒 Thêm vào giỏ: ${dish.name} (${dishId})`);
          }
        }

        console.log(`[MIMI] ✅ Thành công lần ${attempt}`);
        res.json({ provider: 'groq', model: GROQ_MODEL, reply, action });
        return;

      } catch (err: any) {
        const status = err?.response?.status;
        const errMsg: string = err?.response?.data?.error?.message || err?.message || '';
        lastError = err;

        if (status === 503 || status === 429) {
          if (attempt < MAX_RETRIES) {
            console.log(`[MIMI] ⚠️ Status ${status} — chờ ${RETRY_DELAY_MS / 1000}s rồi thử lại...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            continue;
          }
        } else {
          console.log(`[MIMI] ❌ Lỗi không thể retry: ${status}`);
          break;
        }
      }
    }

    // Hết lần thử
    const detail: string = lastError?.response?.data?.error?.message || lastError?.message || '';
    const status429 = lastError?.response?.status === 429;

    res.status(502).json({
      provider: 'local',
      reply: lastError?.response?.status === 503
        ? 'Mimi đang bận xử lý nhiều yêu cầu, bạn chờ vài giây rồi nhắn lại nhé! 🙏'
        : status429
        ? 'Mimi đang bị giới hạn request. Vui lòng chờ vài giây rồi nhắn lại nhé! ⏳'
        : buildErrorReply(detail),
    });
  },
};
