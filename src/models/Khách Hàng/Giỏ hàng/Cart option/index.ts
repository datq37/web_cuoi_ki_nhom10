import { useState, useEffect } from 'react';

// ─── Kiểu dữ liệu ────────────────────────────────────────────────────────────
export interface TimeSlot {
  time: string;
  label: string;
}

// ─── Hàm tính toán danh sách giờ nhận món (+20p) ─────────────────────────────
const generateTimeSlots = (): TimeSlot[] => {
  const slots = [];
  const now = new Date();
  now.setMinutes(now.getMinutes() + 20); // Cộng thêm 20 phút chuẩn bị

  // Làm tròn lên mốc 15 phút gần nhất
  const remainder = now.getMinutes() % 15;
  if (remainder !== 0) {
    now.setMinutes(now.getMinutes() + (15 - remainder));
  }
  now.setSeconds(0);

  // Tạo 5 mốc thời gian tiếp theo
  for (let i = 0; i < 5; i++) {
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    slots.push({
      time: timeStr,
      label: i === 0 ? 'Sớm nhất' : i === 2 ? 'Cao điểm' : ''
    });
    now.setMinutes(now.getMinutes() + 15);
  }
  return slots;
};

// ─── Model quản lý các tùy chọn trong giỏ hàng ───────────────────────────────
export default function useCartOptionModel() {
  const [pickupTime, setPickupTime] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | undefined>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(generateTimeSlots());

  // Cập nhật danh sách mốc giờ mỗi phút
  useEffect(() => {
    const timer = setInterval(() => {
      const newSlots = generateTimeSlots();
      setTimeSlots(newSlots);
      
      // Nếu giờ hiện tại đã qua mốc đang chọn, tự động nhảy sang mốc sớm nhất mới
      if (pickupTime && !newSlots.find(s => s.time === pickupTime)) {
         setPickupTime(newSlots[0].time);
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [pickupTime]);

  return {
    pickupTime,
    setPickupTime,
    note,
    setNote,
    selectedVoucherId,
    setSelectedVoucherId,
    timeSlots,
  };
}
