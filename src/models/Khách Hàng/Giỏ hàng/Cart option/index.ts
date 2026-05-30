import { useState, useEffect } from 'react';
import type { TimeSlot } from '@/services/Khách hàng/Giỏ hàng/cartoption/typing';
import { formatTimeHHMM } from '@/utils/format';
//  tính  giờ nhận món 
const generateTimeSlots = (): TimeSlot[] => {
  const slots = [];
  const now = new Date();
  now.setMinutes(now.getMinutes() + 20);
  const remainder = now.getMinutes() % 15;
  if (remainder !== 0) {
    now.setMinutes(now.getMinutes() + (15 - remainder));
  }
  now.setSeconds(0);
  for (let i = 0; i < 5; i++) {
    const timeStr = formatTimeHHMM(now);
    slots.push({
      time: timeStr,
      label: i === 0 ? 'Sớm nhất' : i === 2 ? 'Cao điểm' : ''
    });
    now.setMinutes(now.getMinutes() + 15);
  }
  return slots;
};

export default function useCartOptionModel() {
  const [pickupTime, setPickupTime] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | undefined>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(generateTimeSlots());
  useEffect(() => {
    const timer = setInterval(() => {
      const newSlots = generateTimeSlots();
      setTimeSlots(newSlots);
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
