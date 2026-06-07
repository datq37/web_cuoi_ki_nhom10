import { useCallback, useMemo, useState, useEffect } from 'react';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { SyncAdapters } from '@/services/api/adapters';
import { hasLoginToken } from '@/utils/auth';

const KEY_HISTORY = 'lich_su_nhap';
const KEY_MIN_STOCK = 'kho_muc_toi_thieu';

const DU_HANG  = 'du_hang';
const SAP_HET  = 'sap_het';
const HET_HANG = 'het_hang';

function calcTrangThai(tonKho: number, mucToiThieu: number): string {
  if (tonKho === 0) return HET_HANG;
  if (tonKho < mucToiThieu) return SAP_HET;
  return DU_HANG;
}

function readMinStockMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(KEY_MIN_STOCK);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveMinStock(id: string, mucToiThieu: number) {
  const next = { ...readMinStockMap(), [id]: Number(mucToiThieu) || 0 };
  try { localStorage.setItem(KEY_MIN_STOCK, JSON.stringify(next)); } catch { /* */ }
}

function removeMinStock(id: string) {
  const next = readMinStockMap();
  delete next[id];
  try { localStorage.setItem(KEY_MIN_STOCK, JSON.stringify(next)); } catch { /* */ }
}

function applyMinStock(item: any, minStockMap: Record<string, number>) {
  const mucToiThieu = Number(minStockMap[item.id] ?? item.mucToiThieu ?? 10);
  return {
    ...item,
    mucToiThieu,
    trangThai: calcTrangThai(Number(item.tonKho) || 0, mucToiThieu),
  };
}

function nowStr() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

export default function useKhoNguyenLieuModel() {
  const [items, setItems] = useState<any[]>([]);

  const fetchItems = useCallback(async () => {
    if (!hasLoginToken()) {
      setItems([]);
      return;
    }
    try {
      const res = await axios.get(`${ip3}/inventory`);
      if (res.data && res.data.items) {
        const minStockMap = readMinStockMap();
        setItems(res.data.items
          .map(SyncAdapters.mapAdminInventoryToUI)
          .map((item: any) => applyMinStock(item, minStockMap)));
      }
    } catch (error) {
      console.error("Failed to load inventory:", error);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const [lichSuNhap, setLichSuNhap] = useState<any[]>(() => {
    try {
      const s = localStorage.getItem(KEY_HISTORY);
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });

  const stats = useMemo(() => ({
    tongNguyenLieu: items.length,
    sapHetHet: items.filter((n) => n.trangThai === SAP_HET || n.trangThai === HET_HANG).length,
    giaTri: items.reduce((s: number, n: any) => s + n.tonKho * n.giaNhap, 0),
    nhaCungCap: new Set(items.map((n: any) => n.nhaCungCap)).size,
  }), [items]);

  const nhaCungCapOptions = useMemo(() =>
    Array.from(new Set(items.map((n: any) => n.nhaCungCap))),
  [items]);

  const canNhapThemItems = useMemo(() =>
    items.filter((n: any) => n.trangThai !== DU_HANG),
  [items]);

  const addLichSu = useCallback((entries: any[]) => {
    setLichSuNhap((p: any[]) => {
      const next = [...entries, ...p];
      try { localStorage.setItem(KEY_HISTORY, JSON.stringify(next)); } catch { /* */ }
      return next;
    });
  }, []);

  const clearLichSu = useCallback(() => {
    setLichSuNhap([]);
    try { localStorage.removeItem(KEY_HISTORY); } catch { /* */ }
  }, []);

  const addNguyenLieu = useCallback(async (values: any) => {
    try {
      const mahang = values.id || `NL${Math.floor(Math.random() * 10000)}`;
      const payload = {
        mahang,
        ten: values.ten,
        donvi: values.donVi,
        nhacungcap: values.nhaCungCap,
        soluong: values.tonKho,
        gianhap: values.giaNhap,
        muctoithieu: values.mucToiThieu,
        trangthai: calcTrangThai(values.tonKho, values.mucToiThieu)
      };
      await axios.post(`${ip3}/inventory`, payload);
      saveMinStock(mahang, values.mucToiThieu);
      await fetchItems();
      return payload;
    } catch (error) {
      console.error("Failed to add inventory", error);
      throw error;
    }
  }, [fetchItems]);

  const updateNguyenLieu = useCallback(async (id: string, values: any) => {
    try {
      const payload = {
        ten: values.ten,
        donvi: values.donVi,
        nhacungcap: values.nhaCungCap,
        soluong: values.tonKho,
        gianhap: values.giaNhap,
        muctoithieu: values.mucToiThieu,
        trangthai: calcTrangThai(values.tonKho, values.mucToiThieu)
      };
      await axios.patch(`${ip3}/inventory/${id}`, payload);
      saveMinStock(id, values.mucToiThieu);
      await fetchItems();
    } catch (error) {
      console.error("Failed to update inventory", error);
      throw error;
    }
  }, [fetchItems]);

  const deleteNguyenLieu = useCallback(async (id: string) => {
    try {
      await axios.delete(`${ip3}/inventory/${id}`);
      removeMinStock(id);
      await fetchItems();
    } catch (error) {
      console.error("Failed to delete inventory", error);
      throw error;
    }
  }, [fetchItems]);

  const restock = useCallback(async (id: string, soLuongNhap: number, newGiaNhap: number) => {
    const n = items.find((x) => x.id === id);
    if (!n) throw new Error("Not found");
    const tonKhoMoi = n.tonKho + soLuongNhap;
    try {
      await axios.patch(`${ip3}/inventory/${id}`, {
        soluong: tonKhoMoi,
        gianhap: newGiaNhap,
        trangthai: calcTrangThai(tonKhoMoi, n.mucToiThieu)
      });
      await fetchItems();
      addLichSu([{ id: `ls_${Date.now()}`, tenNL: n.ten, donVi: n.donVi, soLuong: soLuongNhap, giaNhap: newGiaNhap, ngay: nowStr() }]);
      return { ten: n.ten, donVi: n.donVi };
    } catch (error) {
      console.error("Failed to restock", error);
      throw error;
    }
  }, [items, fetchItems, addLichSu]);

  const bulkRestock = useCallback(async (updates: any[]) => {
    let totalAmount = 0;
    const entries: any[] = [];
    const now = nowStr();
    try {
      await Promise.all(updates.map(async (u) => {
        const n = items.find((x) => x.id === u.id);
        if (!n) return;
        const tonKhoMoi = n.tonKho + u.soLuongNhap;
        await axios.patch(`${ip3}/inventory/${u.id}`, {
          soluong: tonKhoMoi,
          trangthai: calcTrangThai(tonKhoMoi, n.mucToiThieu)
        });
        entries.push({ id: `ls_${Date.now()}_${n.id}`, tenNL: n.ten, donVi: n.donVi, soLuong: u.soLuongNhap, giaNhap: n.giaNhap, ngay: now });
        totalAmount += u.soLuongNhap * n.giaNhap;
      }));
      await fetchItems();
      addLichSu(entries);
      return totalAmount;
    } catch (error) {
      console.error("Failed to bulk restock", error);
      throw error;
    }
  }, [items, fetchItems, addLichSu]);

  return { items, setItems, lichSuNhap, stats, nhaCungCapOptions, canNhapThemItems, clearLichSu, addNguyenLieu, updateNguyenLieu, deleteNguyenLieu, restock, bulkRestock };
}
