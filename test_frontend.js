const apiOrder = {
  "hinhthucthanhtoan": "cash",
  "maDon": "OD-7038749D",
  "maKh": "KH024",
  "tongTien": 35000.0,
  "trangThai": "pending_confirmation",
  "thoiGianDat": "2026-06-04 12:50:09",
  "chitiet": []
};

let mappedStatus = 'pending';
let mappedPayment = 'cash';
const paymentStr = apiOrder.hinhthucthanhtoan;
if (paymentStr === 'banking' || paymentStr === 'qr') {
  mappedPayment = 'qr';
}

const order = {
  id: apiOrder.maDon,
  user: apiOrder.maKh,
  userName: 'Khách hàng',
  dept: 'Căng tin',
  total: apiOrder.tongTien,
  status: mappedStatus,
  payment: mappedPayment,
  created: apiOrder.thoiGianDat || '',
  pickup: '',
  items: (apiOrder.chitiet || []).map(ct => ({
    id: ct.mamon,
    name: ct.thucdon?.ten || 'Món ăn',
    qty: ct.soluong,
    price: ct.gia || 0,
  })),
};

console.log(JSON.stringify(order, null, 2));
