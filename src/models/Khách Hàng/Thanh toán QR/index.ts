import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Order } from '@/services/Khách hàng/Đơn Hàng';
import { QR_PAYMENT_EXPIRE_SECONDS } from '@/services/Khách hàng/Thanh toán QR';

const formatVND = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

const formatCountdown = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, '0');
  const remainSeconds = (safeSeconds % 60).toString().padStart(2, '0');

  return `${minutes}:${remainSeconds}`;
};

const buildQRPayload = (order: Order | null) => {
  if (!order) return '';

  return `CANTEEN_PAYMENT_ORDER_${order.id}_AMOUNT_${order.total}`;
};

export default function useQRPaymentModel() {
  const [pendingOrder, setPendingOrderState] = useState<Order | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(QR_PAYMENT_EXPIRE_SECONDS);

  const setPendingOrder = useCallback((order: Order) => {
    setPendingOrderState(order);
    setStartedAt(Date.now());
    setSecondsLeft(QR_PAYMENT_EXPIRE_SECONDS);
  }, []);

  const clearPendingOrder = useCallback(() => {
    setPendingOrderState(null);
    setStartedAt(null);
    setSecondsLeft(QR_PAYMENT_EXPIRE_SECONDS);
  }, []);

  useEffect(() => {
    if (!pendingOrder || !startedAt) return undefined;

    const updateCountdown = () => {
      const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
      setSecondsLeft(Math.max(0, QR_PAYMENT_EXPIRE_SECONDS - elapsedSeconds));
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, [pendingOrder, startedAt]);

  const formattedAmount = useMemo(
    () => (pendingOrder ? `${formatVND(pendingOrder.total)}đ` : '0đ'),
    [pendingOrder],
  );

  const formattedCountdown = useMemo(
    () => formatCountdown(secondsLeft),
    [secondsLeft],
  );

  const paymentPayload = useMemo(
    () => buildQRPayload(pendingOrder),
    [pendingOrder],
  );

  return {
    pendingOrder,
    setPendingOrder,
    clearPendingOrder,
    secondsLeft,
    formattedAmount,
    formattedCountdown,
    paymentPayload,
    isExpired: secondsLeft <= 0,
  };
}
