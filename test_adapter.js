// Mock enums
const OrderStatus = {
    Pending: 'pending',
    Preparing: 'preparing',
    Ready: 'ready',
    Done: 'done',
    Cancelled: 'cancelled'
};
const PaymentMethod = {
    QR: 'qr',
    Cash: 'cash'
};

function mapOrderResponseToUI(apiOrder) {
    let mappedStatus = OrderStatus.Pending;
    switch (apiOrder.trangThai) {
      case 'pending_confirmation':
      case 'cart':
        mappedStatus = OrderStatus.Pending;
        break;
      case 'confirmed':
      case 'processing':
        mappedStatus = OrderStatus.Preparing;
        break;
      case 'delivered':
        mappedStatus = OrderStatus.Done;
        break;
      case 'cancelled':
        mappedStatus = OrderStatus.Cancelled;
        break;
      default:
        mappedStatus = apiOrder.trangThai || OrderStatus.Pending;
    }

    let mappedPayment = PaymentMethod.Cash;
    const paymentStr = apiOrder.hinhthucthanhtoan;
    if (paymentStr === 'banking' || paymentStr === 'qr') {
      mappedPayment = PaymentMethod.QR;
    } else if (paymentStr === 'cash') {
      mappedPayment = PaymentMethod.Cash;
    }

    return {
      id: apiOrder.maDon,
      user: apiOrder.maKh,
      userName: 'Khách hàng',
      dept: 'Căng tin',
      total: apiOrder.tongTien,
      status: mappedStatus,
      payment: mappedPayment,
      created: apiOrder.thoiGianDat || '',
      pickup: '',
      items: (apiOrder.chitiet || []).map((ct) => ({
        id: ct.mamon,
        name: ct.thucdon?.ten || 'Món ăn',
        qty: ct.soluong,
        price: ct.gia || 0,
      })),
    };
}

const apiOrder = {
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

console.log(JSON.stringify(mapOrderResponseToUI(apiOrder), null, 2));
