import { useState } from 'react';
import { message } from 'antd';
import { useModel } from 'umi';
import { SEED_MENU } from '@/services/KhachHang/ThucDon';
import { showCustomerNotification } from '@/utils/notification';

export default function useDanhGiaModel(order: any, onClose: () => void) {
    const { currentUser } = useModel('KhachHang.Tài Khoản.thanghang');
    const { addReview } = useModel('KhachHang.ThucDon.index');
    const { markAsReviewed } = useModel('KhachHang.Đơn Hàng.Orders');

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState<string[]>([]);
    // tải ảnh đánh giá
    const handleImageFiles = (files: File[]) => {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setImages((prev) => [...prev, ev.target!.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (idx: number) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
    };
    // lấy thông tin món
    const firstItem = order?.items?.[0];
    const dishDetails = SEED_MENU.find(d => d.id === firstItem?.id);
    const dishNames = order?.items?.map((it: any) => it.name).join(' + ');
    // gửi đấnh giá 
    const handleSubmit = () => {
        if (rating === 0) return;
        if (order?.items) {
            order.items.forEach((item: any) => {
                addReview({
                    dishId: item.id,
                    author: currentUser?.name || 'KhachHang',
                    avatar: '😋',
                    rating: rating,
                    comment: comment.trim() || 'Món ăn ngon, đóng gói rất cẩn thận và sạch sẽ!',
                });
            });
        }
        if (order?.id) {
            markAsReviewed(order.id);
        }
        showCustomerNotification('Cảm ơn bạn đã gửi đánh giá món ăn!', 'Phản hồi của bạn đã được ghi nhận và sẽ giúp chúng tôi cải thiện chất lượng phục vụ.', 'success');
        onClose();
    };
    // đóng from khi click ngoài 
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return {
        rating, setRating,
        comment, setComment,
        images,
        handleImageFiles,
        handleRemoveImage,
        handleSubmit,
        handleBackdropClick,
        dishDetails,
        dishNames
    };
}
