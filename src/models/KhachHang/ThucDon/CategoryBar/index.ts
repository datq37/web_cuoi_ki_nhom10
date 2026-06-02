import type { Category, Dish } from '@/services/KhachHang/ThucDon/typing';

export const filterMenuByCategoryAndSearch = (
  menu: Dish[],
  activeCategory: string,
  searchQuery: string
): Dish[] => {
  let result = activeCategory === 'all'
    ? menu
    : menu.filter(dish => dish.cat === activeCategory);

  if (searchQuery.trim()) {
    const keyword = searchQuery.trim().toLowerCase();
    result = result.filter(dish => dish.name.toLowerCase().includes(keyword));
  }

  return result;
};

export const buildCategoryCounts = (
  menu: Dish[],
  categories: Category[]
): Record<string, number> => {
  const counts: Record<string, number> = { all: menu.length };
  categories.forEach(category => {
    if (category.id !== 'all') {
      counts[category.id] = menu.filter(dish => dish.cat === category.id).length;
    }
  });
  return counts;
};
