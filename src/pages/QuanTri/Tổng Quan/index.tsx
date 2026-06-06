import { DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('moment/locale/vi');
import * as XLSX from 'xlsx';
import Topbar from '@/pages/QuanTri/Topbar';
import { useTongQuanModel } from '@/models/QuanTri/Tổng Quan';
import { ETrangThaiTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
import { ETabKey } from '@/services/QuanTri/Tổng Quan/typing';
import BaoCaoModal from './components/BaoCao';
import TacNghiepView from './components/TacNghiep';
import PhanTichView from './components/PhanTich';
import type { AnalysisRange } from './components/PhanTich';
import styles from './index.less';

moment.locale('vi');

const TRANG_THAI_LABEL: Record<string, string> = {
  [ETrangThaiTrucTiep.CHO_XAC_NHAN]:  'Chờ xác nhận',
  [ETrangThaiTrucTiep.DANG_CHE_BIEN]: 'Đang chế biến',
  [ETrangThaiTrucTiep.SAN_SANG]:      'Sẵn sàng',
  [ETrangThaiTrucTiep.HOAN_THANH]:    'Hoàn thành',
  da_huy: 'Đã huỷ',
};

const RANGE_LABEL: Record<AnalysisRange, string> = {
  week: '7 ngày gần nhất',
  month: '4 tuần gần nhất',
  year: '12 tháng gần nhất',
};

const RANGE_FILE_KEY: Record<AnalysisRange, string> = {
  week: '7Ngay',
  month: '4Tuan',
  year: '12Thang',
};

const getOrderDate = (order: any) => {
  const value = order.thoiGianDat || order.thoigiandat || order.createdAt || order.thoiGian;
  const parsed = moment(
    value,
    [moment.ISO_8601, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'DD/MM/YYYY', 'D/M/YYYY'],
    true,
  );
  return parsed.isValid() ? parsed : undefined;
};

const getRangeBounds = (range: AnalysisRange) => {
  const end = moment().endOf('day');
  const start = (() => {
    if (range === 'week') return moment().subtract(6, 'day').startOf('day');
    if (range === 'month') return moment().subtract(27, 'day').startOf('day');
    return moment().subtract(11, 'month').startOf('month');
  })();
  return { start, end };
};

const getOrdersInRange = (orders: any[], range: AnalysisRange) => {
  const { start, end } = getRangeBounds(range);
  return orders.filter((order) => {
    const orderDate = getOrderDate(order);
    if (!orderDate) return false;
    return orderDate.isSameOrAfter(start) && orderDate.isSameOrBefore(end);
  });
};

const TongQuan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ETabKey>(ETabKey.TAC_NGHIEP);
  const [analysisRange, setAnalysisRange] = useState<AnalysisRange>('week');
  const [reportOpen, setReportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { orders, inventory } = useTongQuanModel();
  const reportOrders = React.useMemo(
    () => getOrdersInRange(orders, analysisRange),
    [orders, analysisRange],
  );

  const tabs: { key: ETabKey; label: string }[] = [
    { key: ETabKey.TAC_NGHIEP, label: 'Tác nghiệp' },
    { key: ETabKey.PHAN_TICH,  label: 'Phân tích' },
  ];

  const handleExportExcel = () => {
    setExporting(true);
    try {
      const cancelledIds = new Set<string>();
      reportOrders.forEach((o: any) => { if (o.trangthai === 'da_huy' || o.trangThai === 'da_huy') cancelledIds.add(o.maDon || o._id); });
      const active = reportOrders.filter((o: any) => !cancelledIds.has(o.maDon || o._id));
      const today = moment().format('DD/MM/YYYY');
      const rangeLabel = RANGE_LABEL[analysisRange];
      const { start, end } = getRangeBounds(analysisRange);

      // ── Sheet 1: Tổng quan ─────────────────────────────────────────
      const tongDon    = active.length;
      const hoThanh    = active.filter((o: any) => o.trangthai === ETrangThaiTrucTiep.HOAN_THANH || o.trangThai === ETrangThaiTrucTiep.HOAN_THANH);
      const doanhThu   = hoThanh.reduce((s: any, o: any) => s + (o.tongtien || o.tongTien), 0);
      const choXacNhan = active.filter((o: any) => o.trangthai === ETrangThaiTrucTiep.CHO_XAC_NHAN || o.trangThai === ETrangThaiTrucTiep.CHO_XAC_NHAN).length;
      const dangLam    = active.filter((o: any) => o.trangthai === ETrangThaiTrucTiep.DANG_CHE_BIEN || o.trangThai === ETrangThaiTrucTiep.DANG_CHE_BIEN).length;
      const daHuy      = cancelledIds.size;

      const sheetTongQuan = XLSX.utils.aoa_to_sheet([
        ['BÁO CÁO TỔNG QUAN CĂNG TIN'],
        [`Ngày xuất: ${today}`],
        [`Kỳ báo cáo: ${rangeLabel} (${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')})`],
        [],
        ['CHỈ SỐ', 'GIÁ TRỊ'],
        [`Tổng đơn ${rangeLabel}`, tongDon],
        ['Đơn hoàn thành', hoThanh.length],
        ['Đơn chờ xác nhận', choXacNhan],
        ['Đơn đang chế biến', dangLam],
        ['Đơn đã huỷ', daHuy],
        ['Doanh thu (đ)', doanhThu],
      ]);

      // Style tiêu đề
      sheetTongQuan['A1'] = { v: 'BÁO CÁO TỔNG QUAN CĂNG TIN', t: 's' };
      sheetTongQuan['!cols'] = [{ wch: 28 }, { wch: 20 }];

      // ── Sheet 2: Chi tiết đơn hàng ─────────────────────────────────
      const rows = reportOrders.map((o: any) => {
        const dsMon = o.monan || o.monAn || [];
        const khTen = o.khachhang?.tenkhachhang || o.khachHang?.ten || '';
        const khPhong = o.khachhang?.phongban || o.khachHang?.phong || '';
        const tThai = o.trangthai || o.trangThai;
        return {
          'Mã đơn':      o.maDon || o._id,
          'Khách hàng':  khTen,
          'Phòng ban':   khPhong,
          'Món ăn':      dsMon.map((m: any) => `${m.ten || m.tenmon} x${m.soLuong || m.soluong}`).join(', '),
          'Tổng tiền':   o.tongtien || o.tongTien,
          'Giờ đặt':     o.thoiGianDat || o.thoigiandat || o.thoiGian,
          'Trạng thái':  TRANG_THAI_LABEL[tThai] ?? tThai,
          'Ghi chú':     o.ghichu || o.ghiChu || '',
        };
      });

      const sheetDonHang = XLSX.utils.json_to_sheet(rows);
      sheetDonHang['!cols'] = [
        { wch: 12 }, { wch: 20 }, { wch: 16 }, { wch: 40 },
        { wch: 14 }, { wch: 10 }, { wch: 16 }, { wch: 20 },
      ];

      // ── Tạo workbook ───────────────────────────────────────────────
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheetTongQuan, 'Tổng quan');
      XLSX.utils.book_append_sheet(wb, sheetDonHang, 'Chi tiết đơn hàng');

      const fileName = `BaoCao_CangTin_${RANGE_FILE_KEY[analysisRange]}_${moment().format('DDMMYYYY_HHmm')}.xlsx`;
      XLSX.writeFile(wb, fileName);
      message.success(`Đã xuất file ${fileName}`);
    } catch (err) {
      message.error('Xuất Excel thất bại');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Topbar title="Tổng quan" />

      <div className={styles.pageBody}>
          {/* Hàng 1: Tabs */}
          <div className={styles.tabsRow}>
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className={styles.pageHeader}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                icon={<FileExcelOutlined />}
                loading={exporting}
                onClick={handleExportExcel}
                className={styles.xuatExcelBtn}
              >
                Xuất Excel
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                className={styles.exportBtn}
                onClick={() => setReportOpen(true)}
              >
                Xuất báo cáo
              </Button>
            </div>
          </div>

          {activeTab === ETabKey.PHAN_TICH  && (
            <PhanTichView
              orders={orders}
              range={analysisRange}
              onRangeChange={setAnalysisRange}
            />
          )}
          {activeTab === ETabKey.TAC_NGHIEP && <TacNghiepView orders={orders} inventory={inventory} />}
      </div>

      <BaoCaoModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        orders={reportOrders}
        rangeLabel={RANGE_LABEL[analysisRange]}
        rangeStart={getRangeBounds(analysisRange).start}
        rangeEnd={getRangeBounds(analysisRange).end}
      />
    </>
  );
};

export default TongQuan;
