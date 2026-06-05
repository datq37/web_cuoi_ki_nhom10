import { useState } from 'react';
import type { UserProfile } from '@/services/KhachHang/Tài khoản/typing';
import { showCustomerNotification } from '@/utils/notification';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 2;
const LIST_IGNORE = 'LIST_IGNORE' as const;
// ảnh đại diện
export default function useTaiKhoanModel() {
  const [duongDanAnhDaiDien, datDuongDanAnhDaiDien] = useState<string>('');
  const dongBoAnhDaiDien = (newAvatar: string) => {
    datDuongDanAnhDaiDien(newAvatar);
  };

  const truocKhiTaiLen = (file: File): boolean | typeof LIST_IGNORE => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      showCustomerNotification('Bạn chỉ có thể tải lên file JPG/PNG/WEBP!', undefined, 'error');
      return LIST_IGNORE;
    }

    if (file.size / 1024 / 1024 >= MAX_SIZE_MB) {
      showCustomerNotification(`Hình ảnh phải nhỏ hơn ${MAX_SIZE_MB}MB!`, undefined, 'error');
      return LIST_IGNORE;
    }

    const formData = new FormData();
    formData.append('file', file);

    axios.post(`${ip3}/uploads/image?folder=canteen/avatars`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => {
      datDuongDanAnhDaiDien(res.data?.url || '');
      showCustomerNotification('Đã tải ảnh lên thành công!', undefined, 'success');
    }).catch(() => {
      showCustomerNotification('Không thể tải ảnh lên Cloudinary!', undefined, 'error');
    });

    return false;
  };

  // xử lý submit
  const khiHoanThanh = async (
    values: Partial<UserProfile>,
    capNhatHoSo: (data: Partial<UserProfile>) => void | Promise<void>,
  ) => {
    try {
      await capNhatHoSo({ ...values, avatar: duongDanAnhDaiDien });
      showCustomerNotification('Cập nhật thông tin thành công!', undefined, 'success');
    } catch (error) {
      showCustomerNotification('Lỗi cập nhật thông tin', 'Không thể lưu thông tin vào máy chủ. Vui lòng thử lại.', 'error');
    }
  };

  // trả về true nếu là ảnh đại diện
  const laAnhDaiDien = (): boolean => !!duongDanAnhDaiDien && duongDanAnhDaiDien.length > 2;

  return {
    duongDanAnhDaiDien,
    dongBoAnhDaiDien,
    truocKhiTaiLen,
    khiHoanThanh,
    laAnhDaiDien,
  };
}
