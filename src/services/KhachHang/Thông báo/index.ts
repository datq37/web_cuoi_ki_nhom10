import type { NotificationItem } from './typing';

export * from './typing';

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n2',
    title: 'Đơn hàng đã được đặt thành công',
    message: 'Đơn hàng BU-2842 của bạn đã được xác nhận và bếp đang bắt đầu chuẩn bị.',
    time: '18/05/2026 09:30',
    isRead: true,
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'
  },
  {
    id: 'n3',
    title: 'Đơn hàng sắp được giao tới bạn',
    message: 'Đơn hàng BU-2842 đã chuẩn bị xong và đang trên đường giao đến bạn. Vui lòng chú ý điện thoại!',
    time: '18/05/2026 09:45',
    isRead: false,
    image: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png'
  }
];
