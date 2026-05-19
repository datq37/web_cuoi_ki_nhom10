export interface Review {
    id: string;
    dishId: string;
    author: string;
    avatar: string; // emoji avatar
    rating: number;
    comment: string;
    date: string;
}

export const SEED_REVIEWS: Review[] = [
    {
        id: 'r1', dishId: 'm1', author: 'Minh Anh', avatar: '👩',
        rating: 5, comment: 'Sườn nướng thơm, cơm tấm mềm dẻo, nước mắm đậm đà. Rất ngon, sẽ đặt lại!',
        date: '15/05/2026',
    },
    {
        id: 'r2', dishId: 'm1', author: 'Hoàng Phúc', avatar: '👨',
        rating: 4, comment: 'Khẩu phần vừa đủ, giá hợp lý. Lần sau muốn thêm trứng ốp la.',
        date: '14/05/2026',
    },
    {
        id: 'r3', dishId: 'm2', author: 'Thu Hà', avatar: '👩‍🦱',
        rating: 5, comment: 'Nước dùng ninh kỹ, ngọt tự nhiên. Thịt bò mềm, không dai. Tuyệt vời!',
        date: '16/05/2026',
    },
    {
        id: 'r4', dishId: 'm2', author: 'Văn Đức', avatar: '🧑',
        rating: 4, comment: 'Ngon, nhưng hơi ít rau thơm. Vẫn sẽ ủng hộ nhé.',
        date: '13/05/2026',
    },
    {
        id: 'r5', dishId: 'm3', author: 'Lan Nhi', avatar: '👧',
        rating: 5, comment: 'Chả nướng thơm khói, bún tươi, nước mắm chua ngọt vừa miệng. 10đ!',
        date: '15/05/2026',
    },
    {
        id: 'r6', dishId: 'm4', author: 'Thanh Bình', avatar: '🧑‍🦰',
        rating: 4, comment: 'Gà kho gừng đậm vị, cơm nóng dẻo. Canh rau ngót thanh mát.',
        date: '12/05/2026',
    },
    {
        id: 'r7', dishId: 'm5', author: 'Phương Vy', avatar: '👩‍🦳',
        rating: 5, comment: 'Salad thanh mát, ức gà mềm không bị khô. Rất phù hợp ăn trưa.',
        date: '16/05/2026',
    },
    {
        id: 'r8', dishId: 'm6', author: 'Anh Tuấn', avatar: '👨‍💼',
        rating: 5, comment: 'Mỳ Ý sốt bò đậm đà, phô mai béo ngậy. Lần đầu thử mà mê luôn.',
        date: '14/05/2026',
    },
    {
        id: 'r9', dishId: 'm7', author: 'Quỳnh Như', avatar: '👩‍🍳',
        rating: 4, comment: 'Cơm chiên đều hạt, không bị khô. Lạp xưởng thơm, ăn kèm dưa cải là hết.',
        date: '15/05/2026',
    },
    {
        id: 'r10', dishId: 'm8', author: 'Mạnh Hùng', avatar: '🧔',
        rating: 5, comment: 'Bún đậu mắm tôm chuẩn vị Hà Nội. Đậu chiên vàng giòn. Mắm tôm không quá nặng.',
        date: '17/05/2026',
    },
    {
        id: 'r11', dishId: 'm9', author: 'Hồng Nhung', avatar: '👩',
        rating: 4, comment: 'Đậu mềm, sốt cà chua đậm vị. Món chay nhẹ nhàng, phù hợp ăn chiều.',
        date: '13/05/2026',
    },
    {
        id: 'r12', dishId: 'm10', author: 'Khánh Duy', avatar: '👦',
        rating: 5, comment: 'Chả giò giòn tan, nhân tôm thịt đầy ắp. Chấm nước mắm ngon không kém nhà hàng.',
        date: '16/05/2026',
    },
    {
        id: 'r13', dishId: 'm11', author: 'Mai Linh', avatar: '👩‍🎤',
        rating: 5, comment: 'Trà đào thơm, đá nhiều, ngọt vừa. Uống giữa buổi trưa mát cả người.',
        date: '17/05/2026',
    },
    {
        id: 'r14', dishId: 'm12', author: 'Bảo Long', avatar: '👨‍🎓',
        rating: 5, comment: 'Cà phê phin đúng kiểu truyền thống, sữa đặc vừa, đá viên to. Sẽ order mỗi ngày.',
        date: '17/05/2026',
    },
];
