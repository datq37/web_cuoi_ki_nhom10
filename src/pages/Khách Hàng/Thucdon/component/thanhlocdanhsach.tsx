import React from 'react';
import {
    AppstoreOutlined,
    CoffeeOutlined,
    ShopOutlined,
    ContainerOutlined,
    HeartOutlined,
    FireOutlined,
    RestOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { MENU_CATEGORIES } from '@/services/Khách hàng/Thực đơn';
import { useModel } from 'umi';

// Bảng ánh xạ tên icon sang component Ant Design tương ứng
const IconMap: Record<string, React.ReactNode> = {
    AppstoreOutlined: <AppstoreOutlined />,
    CoffeeOutlined: <CoffeeOutlined />,
    ShopOutlined: <ShopOutlined />,
    ContainerOutlined: <ContainerOutlined />,
    HeartOutlined: <HeartOutlined />,
    FireOutlined: <FireOutlined />,
    RestOutlined: <RestOutlined />,
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
                <SearchOutlined className="search-icon" />
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
                        ×
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
                        {IconMap[cat.icon]}
                        {cat.name}
                        <span className="count">{categoryCounts[cat.id] || 0}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryBar;
