import { SyncAdapters } from './src/services/api/adapters';
import { OrderStatus } from './src/services/KhachHang/Đơn Hàng/typing';

const apiOrder: any = {
  hinhthucthanhtoan: 'cash',
  maDon: 'OD-3A269B6C',
  maKh: 'KH-987E7770',
  tongTien: 70000.0,
  trangThai: 'pending_confirmation',
  thoiGianDat: '2026-06-04 11:35:25',
  chitiet: [
    {
      mamon: 'MON01',
      soluong: 1,
      id: 4,
      orderId: 'OD-3A269B6C',
      gia: 35000.0,
      thucdon: {
        ten: 'Cơm rang dưa bò',
      }
    }
  ]
};

const mapped = SyncAdapters.mapOrderResponseToUI(apiOrder);
console.log(JSON.stringify(mapped, null, 2));
