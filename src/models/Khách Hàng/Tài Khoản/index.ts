import { useState } from 'react';
import { message } from 'antd';
import type { UserProfile } from '@/services/Khách hàng/Tài khoản/typing';

/** Hằng số validate ảnh */
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 2;
const LIST_IGNORE = 'LIST_IGNORE' as const;

/**
 * Model nghiệp vụ trang Cài đặt tài khoản.
 * Quản lý avatar state và cung cấp các hàm xử lý logic.
 * Không phụ thuộc vào useModel khác để tránh vòng lặp khởi tạo.
 */
export default function useTaiKhoanModel() {
  // ─── State ─────────────────────────────────────────────────────────────────

  /** URL ảnh đại diện đang preview (base64 hoặc chữ viết tắt) */
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  // ─── Avatar ────────────────────────────────────────────────────────────────

  /**
   * Đồng bộ avatarUrl với giá trị mới từ bên ngoài (thường từ currentUser).
   * Gọi trong useEffect của component khi currentUser thay đổi.
   */
  const syncAvatar = (newAvatar: string) => {
    setAvatarUrl(newAvatar);
  };

  /**
   * Kiểm tra và đọc file ảnh trước khi upload.
   * - Validate định dạng: JPG / PNG / WEBP
   * - Validate kích thước: tối đa 2MB
   * - Đọc file thành base64 và cập nhật preview
   * Trả về false để ngăn Ant Design tự upload lên server.
   */
  const beforeUpload = (file: File): boolean | typeof LIST_IGNORE => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      message.error('Bạn chỉ có thể tải lên file JPG/PNG/WEBP!');
      return LIST_IGNORE;
    }

    if (file.size / 1024 / 1024 >= MAX_SIZE_MB) {
      message.error(`Hình ảnh phải nhỏ hơn ${MAX_SIZE_MB}MB!`);
      return LIST_IGNORE;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
      message.success('Đã tải ảnh lên thành công!');
    };

    return false;
  };

  // ─── Form submit ───────────────────────────────────────────────────────────

  /**
   * Xử lý lưu hồ sơ.
   * Nhận callback updateProfile từ bên ngoài để tránh phụ thuộc circular.
   */
  const onFinish = (
    values: Partial<UserProfile>,
    updateProfile: (data: Partial<UserProfile>) => void,
  ) => {
    updateProfile({ ...values, avatar: avatarUrl });
    message.success('Cập nhật thông tin thành công!');
  };

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /**
   * Trả về true nếu avatarUrl là ảnh thực sự (base64 / URL),
   * false nếu chỉ là chữ viết tắt (ví dụ "MA").
   */
  const isAvatarImage = (): boolean => !!avatarUrl && avatarUrl.length > 2;

  return {
    avatarUrl,
    syncAvatar,
    beforeUpload,
    onFinish,
    isAvatarImage,
  };
}
