import { useCallback, useMemo, useState } from 'react';

const KEY_HISTORY = 'lich_su_nhap';

const DU_HANG  = 'du_hang';
const SAP_HET  = 'sap_het';
const HET_HANG = 'het_hang';

function calcTrangThai(tonKho: number, mucToiThieu: number): string {
  if (tonKho === 0) return HET_HANG;
  if (tonKho < mucToiThieu) return SAP_HET;
  return DU_HANG;
}

function nowStr() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

export default function useKhoNguyenLieuModel() {
  const [items, setItems] = useState<any[]>([]);

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

  const addNguyenLieu = useCallback((values: any) => {
    const item = { ...values, id: `nl_${Date.now()}`, trangThai: calcTrangThai(values.tonKho, values.mucToiThieu) };
    setItems((p) => [item, ...p]);
    return item;
  }, []);

  const updateNguyenLieu = useCallback((id: string, values: any) => {
    setItems((p) => p.map((n: any) => n.id === id ? { ...n, ...values, trangThai: calcTrangThai(values.tonKho, values.mucToiThieu) } : n));
  }, []);

  const deleteNguyenLieu = useCallback((id: string) => {
    setItems((p) => p.filter((n: any) => n.id !== id));
  }, []);

  const restock = useCallback((id: string, soLuongNhap: number, newGiaNhap: number) => {
    let ten = '', donVi = '';
    setItems((p) => p.map((n: any) => {
      if (n.id !== id) return n;
      ten = n.ten; donVi = n.donVi;
      const tonKhoMoi = n.tonKho + soLuongNhap;
      return { ...n, tonKho: tonKhoMoi, giaNhap: newGiaNhap, trangThai: calcTrangThai(tonKhoMoi, n.mucToiThieu) };
    }));
    addLichSu([{ id: `ls_${Date.now()}`, tenNL: ten, donVi, soLuong: soLuongNhap, giaNhap: newGiaNhap, ngay: nowStr() }]);
    return { ten, donVi };
  }, [addLichSu]);

  const bulkRestock = useCallback((updates: any[]) => {
    let totalAmount = 0;
    const entries: any[] = [];
    const now = nowStr();
    setItems((p) => p.map((n: any) => {
      const u = updates.find((x) => x.id === n.id);
      if (!u) return n;
      entries.push({ id: `ls_${Date.now()}_${n.id}`, tenNL: n.ten, donVi: n.donVi, soLuong: u.soLuongNhap, giaNhap: n.giaNhap, ngay: now });
      totalAmount += u.soLuongNhap * n.giaNhap;
      const tonKhoMoi = n.tonKho + u.soLuongNhap;
      return { ...n, tonKho: tonKhoMoi, trangThai: calcTrangThai(tonKhoMoi, n.mucToiThieu) };
    }));
    addLichSu(entries);
    return totalAmount;
  }, [addLichSu]);

  return { items, setItems, lichSuNhap, stats, nhaCungCapOptions, canNhapThemItems, clearLichSu, addNguyenLieu, updateNguyenLieu, deleteNguyenLieu, restock, bulkRestock };
}
