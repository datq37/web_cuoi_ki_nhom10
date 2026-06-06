import type { DoanhThuNgay } from '@/services/QuanTri/Tổng Quan/typing';
import { ELoaiGhiChu, ETrangThaiDon, ETrangThaiTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
import type { DonTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
import { formatCurrency } from '@/utils/format';
import { useState, useCallback, useEffect } from 'react';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { hasLoginToken } from '@/utils/auth';
import { SyncAdapters } from '@/services/api/adapters';

// formatter
export const fmt = formatCurrency;
export const fmtShort = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}tr`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}k`;
  return `${v}`;
};

// lọc đơn
export const filterDon = (
  list: DonTrucTiep[],
  trangThai: ETrangThaiTrucTiep,
) => list.filter((d) => d.trangThai === trangThai);

export const tongTienCot = (list: DonTrucTiep[]) =>
  list.reduce((s, d) => s + d.tongTien, 0);

// config kanban
export const COT_CONFIG: Record<
  ETrangThaiTrucTiep,
  { tieuDe: string; mau: string; bgLight: string; actionLabel: string; actionColor: string }
> = {
  [ETrangThaiTrucTiep.CHO_XAC_NHAN]: {
    tieuDe: 'Chờ xác nhận',
    mau: '#f97316',
    bgLight: '#fff7ed',
    actionLabel: 'Xác nhận',
    actionColor: '#16a34a',
  },
  [ETrangThaiTrucTiep.DANG_CHE_BIEN]: {
    tieuDe: 'Đang chế biến',
    mau: '#3b82f6',
    bgLight: '#eff6ff',
    actionLabel: 'Hoàn tất',
    actionColor: '#3b82f6',
  },
  [ETrangThaiTrucTiep.SAN_SANG]: {
    tieuDe: 'Sẵn sàng',
    mau: '#8b5cf6',
    bgLight: '#f5f3ff',
    actionLabel: 'Giao xong',
    actionColor: '#8b5cf6',
  },
  [ETrangThaiTrucTiep.HOAN_THANH]: {
    tieuDe: 'Hoàn thành',
    mau: '#16a34a',
    bgLight: '#f0fdf4',
    actionLabel: '',
    actionColor: '#16a34a',
  },
};

export const GHI_CHU_CONFIG: Record<ELoaiGhiChu, { label: string; mau: string; bg: string }> = {
  [ELoaiGhiChu.IT_CAY]:     { label: 'Ít cay',      mau: '#f97316', bg: '#fff7ed' },
  [ELoaiGhiChu.KHONG_HANH]: { label: 'Không hành', mau: '#f97316', bg: '#fff7ed' },
  [ELoaiGhiChu.MANG_DI]:    { label: 'Mang đi',    mau: '#8b5cf6', bg: '#f5f3ff' },
};

// biểu đồ phân tích
export const buildBarLineOptions = (categories: string[]) => ({
  chart: { type: 'bar' as const, toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#16a34a', '#d1d5db'],
  plotOptions: {
    bar: { columnWidth: '55%', borderRadius: 4, borderRadiusApplication: 'end' as const },
  },
  stroke: { width: [0, 2], dashArray: [0, 6], curve: 'straight' as const },
  xaxis: {
    categories,
    labels: { style: { colors: '#9ca3af', fontSize: '12px' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: '#9ca3af', fontSize: '11px' },
      formatter: (v: number) => fmtShort(v),
    },
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0],
    formatter: (v: number) => fmtShort(v),
    offsetY: -6,
    style: { fontSize: '10px', colors: ['#374151'], fontWeight: '500' },
    background: { enabled: false },
  },
  grid: { borderColor: '#f3f4f6', strokeDashArray: 4, yaxis: { lines: { show: true } } },
  legend: { show: false },
  tooltip: { y: { formatter: (v: number) => fmt(v) } },
  fill: { opacity: [1, 0.6] },
});

// config trạng thái đơn
export const TRANG_THAI_DON_CONFIG: Record<
  ETrangThaiDon,
  { label: string; color: string; bg: string }
> = {
  [ETrangThaiDon.CHO_XAC_NHAN]:  { label: 'Chờ xác nhận',  color: '#ea580c', bg: '#fff7ed' },
  [ETrangThaiDon.DANG_CHUAN_BI]: { label: 'Đang chuẩn bị', color: '#2563eb', bg: '#eff6ff' },
  [ETrangThaiDon.DANG_GIAO]:     { label: 'Đang giao',      color: '#0891b2', bg: '#ecfeff' },
  [ETrangThaiDon.HOAN_THANH]:    { label: 'Hoàn thành',     color: '#16a34a', bg: '#f0fdf4' },
  [ETrangThaiDon.DA_HUY]:        { label: 'Đã hủy',         color: '#6b7280', bg: '#f9fafb' },
};

export const getTrangThaiDon = (key: ETrangThaiDon) =>
  TRANG_THAI_DON_CONFIG[key] ?? TRANG_THAI_DON_CONFIG[ETrangThaiDon.CHO_XAC_NHAN];

// biểu đồ tác nghiệp
export const buildAreaOptions = (categories: string[]) => ({
  chart: { type: 'area' as const, toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#16a34a'],
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 100] } },
  stroke: { curve: 'smooth' as const, width: 2.5 },
  xaxis: {
    categories,
    labels: { style: { colors: '#9ca3af', fontSize: '12px' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { labels: { style: { colors: '#9ca3af', fontSize: '11px' }, formatter: (v: number) => fmtShort(v) } },
  grid: { borderColor: '#f3f4f6', strokeDashArray: 4 },
  dataLabels: { enabled: false },
  markers: { size: 4, colors: ['#16a34a'], strokeColors: '#fff', strokeWidth: 2 },
  tooltip: { y: { formatter: (v: number) => fmt(v) } },
});

export const tinhTongDoanhThu = (data: DoanhThuNgay[]) =>
  data.reduce((s, d) => s + d.doanhThu, 0);

export const buildDonutOptions = (labels: string[], colors: string[], total: number, totalLabel = 'Danh mục') => ({
  chart: { type: 'donut' as const, fontFamily: 'inherit' },
  colors,
  labels,
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          total: {
            show: true,
            showAlways: true,
            label: totalLabel,
            fontSize: '12px',
            color: '#6b7280',
            formatter: () => String(total),
          },
          value: { fontSize: '22px', fontWeight: 700, color: '#111827', offsetY: 4 },
        },
      },
    },
  },
  stroke: { width: 2, colors: ['#fff'] },
  tooltip: { y: { formatter: (v: number) => `${v}%` } },
});

const HOAN_THANH = 'hoan_thanh';
const CHO_XAC_NHAN = 'cho_xac_nhan';
const DANG_CHE_BIEN = 'dang_che_bien';
const DA_HUY = 'da_huy';
const CANCELLED = 'cancelled';
const PENDING = 'pending_confirmation';
const CONFIRMED = 'confirmed';
const PROCESSING = 'processing';
const DELIVERED = 'delivered';

const localizeOrderStatus = (order: any) => {
  let trangThai = order.trangThai;
  if (trangThai === CANCELLED) trangThai = DA_HUY;
  else if (trangThai === PENDING) trangThai = CHO_XAC_NHAN;
  else if (trangThai === CONFIRMED || trangThai === PROCESSING) trangThai = DANG_CHE_BIEN;
  else if (trangThai === DELIVERED) trangThai = HOAN_THANH;
  return { ...order, trangThai };
};

const pickArrayPayload = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export function useTongQuanModel() {
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!hasLoginToken()) {
      setOrders([]);
      setInventory([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [resOrders, resInventory] = await Promise.all([
        axios.get(`${ip3}/admin/orders`),
        axios.get(`${ip3}/inventory`),
      ]);
      const mappedOrders = pickArrayPayload(resOrders.data)
        .map(SyncAdapters.mapAdminOrderToUI)
        .map(localizeOrderStatus);
      const mappedInventory = pickArrayPayload(resInventory.data).map(SyncAdapters.mapAdminInventoryToUI);
      setOrders(mappedOrders);
      setInventory(mappedInventory);
    } catch (err) {
      console.error('Error fetching tong quan data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { orders, inventory, loading, refresh: fetchData };
}
