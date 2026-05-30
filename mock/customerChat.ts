// Nạp cấu hình từ tệp .env.local trong thư mục gốc của dự án
const path = require('path');
const dotenv = require('dotenv');

// Ưu tiên nạp cấu hình từ .env.local trước, sau đó mới nạp từ .env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Khai báo model AI được sử dụng
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const MAX_RETRIES = 3;       // Số lần thử lại
const RETRY_DELAY_MS = 2000; // Chờ 2 giây

const getApiKey = (): string | undefined => {
  const key = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY; // Dự phòng trong trường hợp thay đổi tên biến môi trường
  if (key && key.trim()) return key.trim();
  return undefined;
};

// Phân tích dữ liệu đầu vào (body) một cách an toàn, hỗ trợ cả định dạng chuỗi và đối tượng
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

// Định nghĩa tên các danh mục thực đơn bằng tiếng Việt
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

  // Phân loại riêng danh sách thức ăn và đồ uống
  const foodList = dishList.filter((d: any) => d.category !== 'drink');
  const drinkList = dishList.filter((d: any) => d.category === 'drink');

  const formatDish = (dish: any) => {
    const cat = CATEGORY_LABEL[dish.category] || dish.category;
    const kcal = dish.kcal ? `${dish.kcal} kcal` : '';
    const rating = dish.rating ? `⭐${dish.rating}` : '';
    const sold = dish.sold ? `bán ${dish.sold}` : '';
    const meta = [cat, kcal, rating, sold].filter(Boolean).join(' | ');
    // Đính kèm mã ID ngầm để AI sử dụng khi cần chốt đơn thêm vào giỏ hàng
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
    '=== VAI TRÒ CHUNG ===',
    'Bạn là một AI siêu thông minh (tương tự ChatGPT) đang đóng vai Mimi - trợ lý thân thiện tại căng tin doanh nghiệp.',
    'Bạn có thể nói chuyện tự nhiên, thoải mái về MỌI CHỦ ĐỀ khách hàng muốn (công việc, tâm sự, giải trí, đồ ăn...) giống như một người bạn thực sự.',
    '',
    '=== HƯỚNG DẪN GIAO TIẾP & BÁN HÀNG ===',
    '- NGÔN NGỮ TỰ NHIÊN: Cực kỳ linh hoạt, vui vẻ, không bao giờ dùng văn mẫu hay nói chuyện rập khuôn. Có thể xưng "mình" - "bạn" và dùng emoji cho sinh động.',
    '- TRÒ CHUYỆN ĐA NĂNG: Khách hỏi gì đáp nấy. Nếu khách nhờ tư vấn đồ ăn, hãy xem "THỨC ĂN HÔM NAY" để gợi ý. Nếu khách hỏi chuyện ngoài lề, cứ thoải mái chém gió.',
    '- CÔNG CỤ THÊM GIỎ HÀNG (RẤT QUAN TRỌNG): Bất cứ khi nào bạn nhận thấy khách đã quyết định MUA một món (vd: "lấy 2 trà đào", "cho mình món đó", "ok lấy đi"), bạn hãy tự động chốt đơn bằng cách lén chèn mã lệnh này vào câu trả lời: [ACTION:ADD_TO_CART:mã_món:số_lượng]. (Ví dụ: [ACTION:ADD_TO_CART:m2:2]). Mặc định số lượng là 1.',
    '- XÁC NHẬN TINH TẾ: Khi đã dùng lệnh thêm giỏ hàng, hãy nói một câu xác nhận thật tự nhiên (vd: "Okie, mình bỏ vào giỏ cho bạn rồi nha!"). Đừng hỏi lại khách nếu họ đã chốt.',
    '- QUY TẮC BẢO MẬT: Bạn chỉ dùng mã [id:xxx] để lấy ID cho lệnh ADD_TO_CART. Tuyệt đối không in chữ [id:xxx] ra cho khách xem. Khách chỉ cần nhận được lời lẽ tự nhiên của bạn.',
    '',
    '=== THÔNG TIN CĂNG TIN ===',
    '- Thanh toán: Hỗ trợ tiền mặt (Cash) và Chuyển khoản (QR / Bank transfer).',
    '- Cách thức: Khách đặt món trên web, thanh toán, rồi hệ thống sẽ GIAO TẬN NƠI (không phải đến quầy nhận món).',
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
    
    // Cấu hình dữ liệu gửi đi theo chuẩn OpenAI để tương thích với API của Groq
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

        // Trích xuất lệnh thêm vào giỏ hàng từ câu trả lời của AI
        const actionMatch = rawReply.match(/\[ACTION:ADD_TO_CART:([^\]:]+)(?::(\d+))?\]/);
        let reply = rawReply.replace(/\[ACTION:ADD_TO_CART:[^\]]+\]/g, '').trim();
        reply = reply.replace(/\[id:[^\]]+\]/g, '').trim(); // Xoá bỏ mã ID nếu AI vô tình in ra văn bản

        let action = undefined;
        if (actionMatch) {
          const dishId = actionMatch[1].trim();
          const qty = actionMatch[2] ? parseInt(actionMatch[2], 10) : 1;
          const dish = (body.dishes || []).find((d: any) => d.id === dishId);
          if (dish) {
            action = { type: 'ADD_TO_CART', dishId, dishName: dish.name, qty: qty };
            console.log(`[MIMI] 🛒 Thêm vào giỏ: ${dish.name} (${dishId}) x ${qty}`);
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

    // Xử lý thông báo lỗi khi đã hết số lần thử kết nối
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
