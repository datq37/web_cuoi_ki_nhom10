import re

with open('src/services/QuanTri/Tổng Quan/index.ts', 'r') as f:
    content = f.read()

# Replace the export const mockData = { ... } with empty stubs
empty_mockdata = """export const mockData: TongQuanData = {
  tacNghiep: {
    statCards: [],
    infoCard: {
      tiLeHoanThanh: 0,
      monBanChayNhat: { ten: '', soSuat: 0, hinhAnh: '' },
      khuyenMai: { ten: '', conLai: '' },
      diemHaiLong: { diem: 0, soDanhGia: 0 },
    },
    doanhThu7Ngay: [],
    trangThaiDon: [],
    tongDonHomNay: 0,
    donGanDay: [],
    topMon: [],
  },
  trucTiep: {
    thongKe: { donCho: 0, dangCheBien: 0, sanSangGiao: 0, thoiGianTB: 0 },
    tomTat: { tongDon: 0, khachHang: 0, doanhThu: 0, thoiGianTB: 0 },
    donHang: [],
  },
  phanTich: {
    banners: [],
    doanhThuTuan: [],
    danhMuc: [],
    tongDanhMuc: 0,
    topMon: [],
    donTheoTrangThai: [],
    hieuSuat: [],
    hoatDong: [],
  },
};
"""

content = re.sub(r'export const mockData: TongQuanData = \{.*?\n\};\n', empty_mockdata, content, flags=re.DOTALL)

with open('src/services/QuanTri/Tổng Quan/index.ts', 'w') as f:
    f.write(content)
