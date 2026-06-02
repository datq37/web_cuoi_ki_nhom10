import React from 'react';
import { useModel } from 'umi';
import type { DayTabsProps } from '@/services/KhachHang/ThucDon/DateTabs/typing';
const DayTabs: React.FC<DayTabsProps> = ({ selected, onSelect }) => {
    const { days } = useModel('KhachHang.ThucDon.index');

    return (
        <div className="thanhChonNgay">
            {days.map((d, i) => (
                <button
                    key={i}
                    className={`theNgay ${selected === i ? 'dangChon' : ''} ${d.isToday ? 'homNay' : ''} ${d.isPast ? 'quaKhu' : ''}`}
                    disabled={d.isPast}
                    aria-disabled={d.isPast}
                    title={d.isPast ? 'Ngày đã qua' : undefined}
                    onClick={() => {
                        if (!d.isPast) onSelect(i);
                    }}
                >
                    <span className="tenNgay">{d.name}</span>
                    <span className="soNgay">{d.num}/{d.month}</span>
                </button>
            ))}
        </div>
    );
};

export default DayTabs;
