import re

with open('src/models/KhachHang/ThucDon/index.ts', 'r') as f:
    content = f.read()

# Add categories state and fetch logic
# We need to add state for categories
categories_state = """
  const [categories, setCategories] = useState<{id: string, label: string}[]>([{ id: 'all', label: 'Tất cả' }]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get(`${ip3}/categories`);
        if (res.data && Array.isArray(res.data)) {
          const fetchedCats = res.data.map((c: any) => ({
            id: String(c.id),
            label: c.name || 'Danh mục'
          }));
          setCategories([{ id: 'all', label: 'Tất cả' }, ...fetchedCats]);
        }
      } catch (e) {
        console.error("Failed to load categories:", e);
      }
    };
    loadCategories();
  }, []);
"""

content = content.replace("const [dishes, setDishes] = useState<Dish[]>([]);", 
                          "const [dishes, setDishes] = useState<Dish[]>([]);\n" + categories_state)

# Now modify categoryCounts to use the new categories state instead of MENU_CATEGORIES
content = content.replace("buildCategoryCounts(dishes, MENU_CATEGORIES),", "buildCategoryCounts(dishes, categories as any),")

# And add categories to the returned object
content = content.replace("dishes,", "dishes,\ncategories,")

with open('src/models/KhachHang/ThucDon/index.ts', 'w') as f:
    f.write(content)
