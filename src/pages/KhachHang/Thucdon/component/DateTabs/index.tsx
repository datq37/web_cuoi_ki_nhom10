import React from 'react';
import { useModel } from 'umi';
import { Typography } from 'antd';
import type { DayTabsProps } from '@/services/KhachHang/ThucDon/DateTabs/typing';
const DayTabs: React.FC<DayTabsProps> = ({ selected, onSelect }) => {
    const { days } = useModel('KhachHang.ThucDon.index');

    return (
        <div className="thanhChonNgay">
            {days.map((d, i) => (
                <div
                    key={i}
                    role="button"
                    tabIndex={d.isPast ? -1 : 0}
                    className={`theNgay ${selected === i ? 'dangChon' : ''} ${d.isToday ? 'homNay' : ''} ${d.isPast ? 'quaKhu' : ''}`}
                    aria-disabled={d.isPast}
                    title={d.isPast ? 'Ngày đã qua' : undefined}
                    onClick={() => {
                        if (!d.isPast) onSelect(i);
                    }}
                >
                    <Typography.Text className="tenNgay">{d.name}</Typography.Text>
                    <Typography.Text className="soNgay">{d.num}/{d.month}</Typography.Text>
                </div>
            ))}
        </div>
    );
};

export default DayTabs;
