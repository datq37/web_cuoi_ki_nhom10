import { Table } from 'antd';
import type { ColumnsType, TableLocale } from 'antd/es/table';
import React, { useMemo } from 'react';

/**
 * TableStaticData<T>
 *
 * Component bảng dữ liệu tĩnh (client-side):
 * - Generic type T
 * - Tìm kiếm client-side qua searchValue + searchFields
 * - Phân trang client-side
 * - Tích hợp với PageToolbar: nhận searchValue từ ngoài vào
 */
export interface TableStaticDataProps<T extends object> {
  /** Toàn bộ dữ liệu — component tự filter + phân trang */
  dataSource: T[];
  columns: ColumnsType<T>;
  rowKey: string | ((record: T) => string);

  /** Từ khoá tìm kiếm (truyền từ PageToolbar bên ngoài) */
  searchValue?: string;
  /**
   * Các field của T dùng để so sánh với searchValue.
   * Nếu không truyền: tự động tìm trên tất cả field string/number.
   */
  searchFields?: (keyof T)[];

  pageSize?: number;
  showTotal?: boolean;
  loading?: boolean;

  onRow?: (record: T) => React.HTMLAttributes<HTMLElement>;
  rowClassName?: string | ((record: T, index: number) => string);
  locale?: TableLocale;
  scroll?: { x?: number | string; y?: number | string };
  className?: string;
  size?: 'large' | 'middle' | 'small';
}

/** So khớp record với keyword trên các fields chỉ định */
function matchKeyword<T extends object>(
  record: T,
  keyword: string,
  fields?: (keyof T)[],
): boolean {
  const lkw = keyword.toLowerCase();
  const keys = fields ?? (Object.keys(record) as (keyof T)[]);
  return keys.some((k) => {
    const val = record[k];
    if (typeof val === 'string') return val.toLowerCase().includes(lkw);
    if (typeof val === 'number') return String(val).includes(lkw);
    return false;
  });
}

function TableStaticData<T extends object>({
  dataSource,
  columns,
  rowKey,
  searchValue,
  searchFields,
  pageSize = 10,
  showTotal = true,
  loading,
  onRow,
  rowClassName,
  locale,
  scroll,
  className,
  size = 'middle',
}: TableStaticDataProps<T>) {
  // Filter client-side
  const filtered = useMemo(() => {
    if (!searchValue?.trim()) return dataSource;
    return dataSource.filter((r) =>
      matchKeyword(r, searchValue.trim(), searchFields),
    );
  }, [dataSource, searchValue, searchFields]);

  return (
    <Table<T>
      dataSource={filtered}
      columns={columns}
      rowKey={rowKey as any}
      loading={loading}
      size={size}
      onRow={onRow}
      rowClassName={rowClassName as any}
      locale={locale}
      scroll={scroll}
      className={className}
      pagination={{
        pageSize,
        showSizeChanger: false,
        hideOnSinglePage: filtered.length <= pageSize,
        showTotal: showTotal
          ? (total, range) => `${range[0]}–${range[1]} / ${total} bản ghi`
          : undefined,
      }}
    />
  );
}

export default TableStaticData;
