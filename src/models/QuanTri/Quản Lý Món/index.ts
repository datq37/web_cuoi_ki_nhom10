import { useCallback, useEffect, useMemo, useState } from 'react';
import { DANH_SACH_MON } from '@/services/QuanTri/Quản Lý Món';
import { EDanhMuc } from '@/services/QuanTri/Quản Lý Món/typing';

const KEY = 'admin_dishes';

export default function useQuanLyMonModel() {
  const [items, setItems] = useState(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) return JSON.parse(s);
    } catch { /* */ }
    return [...DANH_SACH_MON];
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const tabCounts = useMemo(() => ({
    tat_ca: items.length,
    [EDanhMuc.MON_CHINH]: items.filter((m: any) => m.danhMuc === EDanhMuc.MON_CHINH).length,
    [EDanhMuc.DO_UONG]:   items.filter((m: any) => m.danhMuc === EDanhMuc.DO_UONG).length,
    [EDanhMuc.AN_VAT]:    items.filter((m: any) => m.danhMuc === EDanhMuc.AN_VAT).length,
    [EDanhMuc.MON_CHAY]:  items.filter((m: any) => m.danhMuc === EDanhMuc.MON_CHAY).length,
  }), [items]);

  const addMon = useCallback((values: any) => {
    const newItem = { ...values, id: `mon_${Date.now()}` };
    setItems((p: any[]) => [newItem, ...p]);
    return newItem;
  }, []);

  const updateMon = useCallback((values: any) => {
    setItems((p: any[]) => p.map((i) => i.id === values.id ? { ...i, ...values } : i));
  }, []);

  const deleteMon = useCallback((id: string) => {
    setItems((p: any[]) => p.filter((i) => i.id !== id));
  }, []);

  const toggleCoSan = useCallback((id: string, coSan: boolean) => {
    setItems((p: any[]) => p.map((m) => m.id === id ? { ...m, coSan } : m));
  }, []);

  return { items, tabCounts, addMon, updateMon, deleteMon, toggleCoSan };
}
