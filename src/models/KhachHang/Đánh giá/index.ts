import { useState } from 'react';
import { useModel } from 'umi';
import { SEED_MENU } from '@/services/KhachHang/ThucDon';
import { showCustomerNotification } from '@/utils/notification';

export default function useDanhGiaModel(order: any, onClose: () => void) {
    const { currentUser } = useModel('KhachHang.Tài Khoản.thanghang');
    const { addReview } = useModel('KhachHang.ThucDon.index');
    const { markAsReviewed } = useModel('KhachHang.Đơn Hàng.Orders');

    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState<string[]>([]);
    
    const items = order?.items || [];
    const currentItem = items[currentItemIndex];

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
    const dishDetails = SEED_MENU.find(d => d.id === currentItem?.id);
    const dishImage = currentItem?.image || dishDetails?.hinhAnh;
    const dishNames = currentItem?.name || 'Món ăn';

    // gửi đấnh giá 
    const handleSubmit = () => {
        if (rating === 0) return;
        if (currentItem) {
            addReview({
                dishId: currentItem.id,
                author: currentUser?.name || 'KhachHang',
                avatar: '😋',
                rating: rating,
                comment: comment.trim() || 'Món ăn ngon, đóng gói rất cẩn thận và sạch sẽ!',
                images: images,
            });
        }

        if (currentItemIndex < items.length - 1) {
            // Chuyển sang món tiếp theo trong đơn
            setCurrentItemIndex(prev => prev + 1);
            // Reset form cho món tiếp theo
            setRating(0);
            setComment('');
            setImages([]);
        } else {
            // Đã đánh giá hết tất cả món trong đơn
            if (order?.id) {
                markAsReviewed(order.id);
            }
            showCustomerNotification(
                'Cảm ơn bạn đã gửi đánh giá!', 
                'Phản hồi của bạn đã được ghi nhận cho toàn bộ món ăn trong đơn.', 
                'success'
            );
            onClose();
        }
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
        dishImage,
        dishNames,
        currentItemIndex,
        totalItems: items.length
    };
}
