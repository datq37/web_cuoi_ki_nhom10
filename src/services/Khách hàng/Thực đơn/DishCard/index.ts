import type { Dish } from './typing';

export const SEED_MENU: Dish[] = [
    { id: 'm1', name: 'Cơm tấm sườn nướng', cat: 'rice', price: 45000, desc: 'Sườn cốt lết nướng than, trứng ốp la, đồ chua, nước mắm ớt.', emoji: '🍱', tags: ['hot'], rating: 4.8, sold: 142, prep: 8, kcal: 720, ingredients: ['Sườn heo', 'Cơm tấm', 'Trứng', 'Dưa leo'] },
    { id: 'm2', name: 'Phở bò tái nạm', cat: 'noodle', price: 50000, desc: 'Bánh phở mềm, nước dùng ninh xương 12 tiếng, hành lá, rau thơm.', emoji: '🍜', tags: [], rating: 4.7, sold: 98, prep: 5, kcal: 580, ingredients: ['Bánh phở', 'Thịt bò', 'Hành lá', 'Quế hồi'] },
    { id: 'm3', name: 'Bún chả Hà Nội', cat: 'noodle', price: 48000, desc: 'Chả viên, chả miếng nướng than hoa, nước mắm chua ngọt, rau sống.', emoji: '🥗', tags: [], rating: 4.6, sold: 86, prep: 7, kcal: 640, ingredients: ['Bún', 'Thịt heo', 'Rau sống', 'Đồ chua'] },
    { id: 'm4', name: 'Gà kho gừng + cơm trắng', cat: 'rice', price: 42000, desc: 'Gà ta kho gừng đậm đà, cơm gạo Jasmine, canh rau ngót.', emoji: '🍗', tags: [], rating: 4.5, sold: 76, prep: 6, kcal: 690, ingredients: ['Thịt gà', 'Gừng', 'Cơm gạo', 'Rau ngót'] },
    { id: 'm5', name: 'Salad ức gà nướng', cat: 'veg', price: 55000, desc: 'Ức gà áp chảo, xà lách, cà chua bi, hạt óc chó, sốt mè rang.', emoji: '🥗', tags: ['veg'], rating: 4.4, sold: 52, prep: 4, kcal: 380, ingredients: ['Ức gà', 'Xà lách', 'Hạt óc chó', 'Sốt mè'] },
    { id: 'm6', name: 'Mỳ Ý sốt bò bằm', cat: 'main', price: 52000, desc: 'Mỳ ý truyền thống, sốt cà chua + bò bằm, phô mai parmesan.', emoji: '🍝', tags: ['new'], rating: 4.6, sold: 64, prep: 9, kcal: 760, ingredients: ['Mỳ Ý', 'Bò bằm', 'Cà chua', 'Phô mai'] },
    { id: 'm7', name: 'Cơm chiên Dương Châu', cat: 'rice', price: 40000, desc: 'Cơm chiên trứng, lạp xưởng, đậu Hà Lan, cà rốt, hành tây.', emoji: '🍳', tags: [], rating: 4.3, sold: 71, prep: 5, kcal: 650, ingredients: ['Cơm', 'Trứng', 'Lạp xưởng', 'Rau củ'] },
    { id: 'm8', name: 'Bún đậu mắm tôm', cat: 'noodle', price: 55000, desc: 'Bún tươi, đậu hũ chiên, chả cốm, thịt luộc, mắm tôm chanh.', emoji: '🥢', tags: ['hot'], rating: 4.7, sold: 88, prep: 6, kcal: 720, ingredients: ['Bún', 'Đậu hũ', 'Chả cốm', 'Mắm tôm'] },
    { id: 'm9', name: 'Đậu hũ sốt cà chua', cat: 'veg', price: 35000, desc: 'Đậu hũ non chiên giòn, sốt cà chua thơm, hành lá rắc.', emoji: '🥬', tags: ['veg'], rating: 4.2, sold: 38, prep: 5, kcal: 320, ingredients: ['Đậu hũ', 'Cà chua', 'Hành lá'] },
    { id: 'm10', name: 'Chả giò rế', cat: 'snack', price: 25000, desc: '4 cuốn chả giò chiên giòn, nhân tôm thịt, rau sống chấm nước mắm.', emoji: '🥟', tags: [], rating: 4.5, sold: 60, prep: 4, kcal: 280, ingredients: ['Bánh tráng', 'Tôm', 'Thịt'] },
    { id: 'm11', name: 'Trà đào cam sả', cat: 'drink', price: 22000, desc: 'Trà đen ướp lạnh, miếng đào tươi, cam vàng, sả thái lát.', emoji: '🍑', tags: [], rating: 4.6, sold: 124, prep: 2, kcal: 120, ingredients: ['Trà', 'Đào', 'Cam', 'Sả'] },
    { id: 'm12', name: 'Cà phê sữa đá', cat: 'drink', price: 18000, desc: 'Cà phê phin truyền thống, sữa đặc, đá viên.', emoji: '☕', tags: [], rating: 4.8, sold: 168, prep: 2, kcal: 180, ingredients: ['Cà phê', 'Sữa đặc'] },
];

export type { Dish, DishCardProps } from './typing';
