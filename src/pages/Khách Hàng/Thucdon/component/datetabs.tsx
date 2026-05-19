import React from 'react';
import { useModel } from 'umi';

// ─── Tab chọn ngày trong tuần — lấy danh sách ngày từ model ─────────────────
interface DayTabsProps {
    selected: number;
    onSelect: (index: number) => void;
}

const DayTabs: React.FC<DayTabsProps> = ({ selected, onSelect }) => {
    const { days } = useModel('Khách Hàng.Thực đơn.index');

    return (
        <div className="day-tabs">
            {days.map((d, i) => (
                <button
                    key={i}
                    className={`day-tab ${selected === i ? 'active' : ''} ${d.isToday ? 'today' : ''}`}
                    onClick={() => onSelect(i)}
                >
                    <span className="day-name">{d.name}</span>
                    <span className="day-num">{d.num}/{d.month}</span>
                </button>
            ))}
        </div>
    );
};

export default DayTabs;
