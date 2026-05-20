import React from 'react';
import {
    Beef,
    Coffee,
    Flame,
    Grid2X2,
    Heart,
    Package,
    Search,
    Soup,
    Utensils,
    X,
} from 'lucide-react';
import { MENU_CATEGORIES } from '@/services/Khách hàng/Thực đơn';
import { useModel } from 'umi';

// Bảng ánh xạ tên icon sang component lucide tương ứng
const IconMap: Record<string, React.ReactNode> = {
    AppstoreOutlined: <Grid2X2 size={15} />,
    CoffeeOutlined: <Beef size={15} />,
    ShopOutlined: <Soup size={15} />,
    ContainerOutlined: <Package size={15} />,
    HeartOutlined: <Heart size={15} />,
    FireOutlined: <Flame size={15} />,
    RestOutlined: <Coffee size={15} />,
};

// ─── Thanh tìm kiếm và lọc theo danh mục món ăn ─────────────────────────────
const CategoryBar: React.FC = () => {
    const {
        activeCategory,
        setActiveCategory,
        categoryCounts,
        searchQuery,
        setSearchQuery,
    } = useModel('Khách Hàng.Thực đơn.index');

    return (
        <div className="filter-section">
            {/* Ô tìm kiếm theo tên món */}
            <div className="search-box">
                <Search className="search-icon" size={18} />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm kiếm món ăn..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        className="search-clear"
                        onClick={() => setSearchQuery('')}
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Chip lọc theo danh mục */}
            <div className="category-bar">
                {MENU_CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        className={`cat-chip ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        {IconMap[cat.icon] || <Utensils size={15} />}
                        {cat.name}
                        <span className="count">{categoryCounts[cat.id] || 0}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryBar;
