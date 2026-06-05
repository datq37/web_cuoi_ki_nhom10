import React from 'react';
import {
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
import { useModel } from 'umi';
import { Input, Typography } from 'antd';
const IconMap: Record<string, React.ReactNode> = {
    AppstoreOutlined: <Grid2X2 size={15} />,
    CoffeeOutlined: <Coffee size={15} />,
    ShopOutlined: <Soup size={15} />,
    ContainerOutlined: <Package size={15} />,
    HeartOutlined: <Heart size={15} />,
    FireOutlined: <Flame size={15} />,
    RestOutlined: <Coffee size={15} />,
    Utensils: <Utensils size={15} />,
};
const CategoryBar: React.FC = () => {
    const {
        activeCategory,
        setActiveCategory,
        categoryCounts,
        categories,
        searchQuery,
        setSearchQuery,
    } = useModel('KhachHang.ThucDon.index');

    return (
        <div className="phanBoLoc">
            <div className="hopTimKiem">
                <Search className="bieuTuongTimKiem" size={18} />
                <Input
                    className="oNhapTimKiem"
                    placeholder="Tìm kiếm món ăn..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    bordered={false}
                />
                {searchQuery && (
                    <div
                        role="button"
                        tabIndex={0}
                        className="nutXoaTimKiem"
                        onClick={() => setSearchQuery('')}
                    >
                        <X size={14} />
                    </div>
                )}
            </div>
            <div className="thanhDanhMuc">
                {(categories || []).map((cat: any) => {
                    const label = cat.label || cat.name || 'Danh mục';
                    return (
                        <div
                            key={cat.id}
                            role="button"
                            tabIndex={0}
                            className={`theDanhMuc ${activeCategory === cat.id ? 'dangChon' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            {cat.image ? (
                                <img className="anhDanhMuc" src={cat.image} alt={label} />
                            ) : (
                                IconMap[cat.icon] || <Utensils size={15} />
                            )}
                            <Typography.Text style={{ color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>{label}</Typography.Text>
                            <span className="soLuong">{categoryCounts[cat.id] || 0}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryBar;
