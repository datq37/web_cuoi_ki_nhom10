import buncha from '@/assets/trangchu/buncha.png';
import nemnuong from '@/assets/trangchu/nemnuong.png';
import pho from '@/assets/trangchu/pho.png';
import xoi from '@/assets/trangchu/xoi.png';

export const foodData = [
  {
    id: 1,
    category: 'Hương vị truyền thống',
    name: 'PHỞ BÒ GIA TRUYỀN',
    menuName: 'PHỞ BÒ',
    subtitle: 'GIA TRUYỀN',
    description: 'Nước dùng thanh ngọt, bánh phở mềm dai, thịt bò tươi ngon mang đậm đà bản sắc tinh hoa ẩm thực Việt Nam.',
    price: '45.000đ',
    image: pho, 
  },
  {
    id: 2,
    category: 'Món ngon đường phố',
    name: 'BÚN CHẢ HƯƠNG LIÊN',
    menuName: 'BÚN CHẢ',
    subtitle: 'HƯƠNG LIÊN',
    description: 'Thịt nướng than hoa thơm lừng ăn kèm nước mắm chua ngọt, hương vị khó phai cho một buổi chiều nhàn rỗi.',
    price: '35.000đ',
    image: buncha, 
  },
  {
    id: 3,
    category: 'Thức quà sáng',
    name: 'XÔI XÉO HÀ NỘI',
    menuName: 'XÔI XÉO',
    subtitle: 'HÀ NỘI',
    description: 'Xôi nếp dẻo thơm, mỡ hành béo ngậy, đỗ xanh bùi bùi. Một khởi đầu hoàn hảo cho ngày mới tràn đầy năng lượng.',
    price: '22.000đ',
    image: xoi, 
  },
  {
    id: 4,
    category: 'Đặc sản miền trung',
    name: 'NEM NƯỚNG NHA TRANG',
    menuName: 'NEM NƯỚNG',
    subtitle: 'NHA TRANG',
    description: 'Nem nướng thơm phức ăn kèm bánh tráng chiên giòn, rau sống và nước chấm đậu phộng thịt băm đặc biệt.',
    price: '40.000đ',
    image: nemnuong, 
  }
];
