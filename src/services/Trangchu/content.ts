import nhanhChongImg from '@/assets/trangchu/nhanhchong.png';
import thuanTienImg from '@/assets/trangchu/thuantien.png';
import sachSeImg from '@/assets/trangchu/sachse.png';

export interface ContentItem {
  id: string;
  title: string;
  image: string;
  description: string;
}

export const contentData: ContentItem[] = [
  {
    id: 'nhanhchong',
    title: 'Nhanh chóng',
    image: nhanhChongImg,
    description: 'Với đội ngũ giao hàng chuyên nghiệp, chúng tôi cam kết mang đến những bữa ăn nóng hổi trong thời gian ngắn nhất. Bạn không cần phải chờ đợi lâu để thưởng thức hương vị tuyệt hảo mà mình yêu thích. Tốc độ và chất lượng luôn đi đôi với nhau.'
  },
  {
    id: 'thuantien',
    title: 'Thuận tiện',
    image: thuanTienImg,
    description: 'Trải nghiệm đặt món trở nên dễ dàng và mượt mà hơn bao giờ hết. Bạn có thể thoải mái lựa chọn phương thức thanh toán linh hoạt và theo dõi đơn hàng mọi lúc mọi nơi. Sự thuận tiện của khách hàng luôn được chúng tôi đặt lên hàng đầu.'
  },
  {
    id: 'sachse',
    title: 'Sạch sẽ',
    image: sachSeImg,
    description: 'Vệ sinh an toàn thực phẩm là tiêu chí cốt lõi trong mọi khâu chế biến. Từ việc tinh tuyển nguyên liệu tươi ngon đến quy trình đóng gói kỹ lưỡng, chúng tôi đảm bảo mỗi món ăn gửi đến bạn đều đạt chuẩn sạch sẽ và an toàn tuyệt đối.'
  }
];
