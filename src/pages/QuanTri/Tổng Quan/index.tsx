import { DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('moment/locale/vi');
import * as XLSX from 'xlsx';
import Topbar from '@/pages/QuanTri/Topbar';
import { fmt, useTongQuanModel } from '@/models/QuanTri/Tổng Quan';
import { ETrangThaiTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
import { ETabKey } from '@/services/QuanTri/Tổng Quan/typing';
import { KEYS, store } from '@/utils/storage';
import BaoCaoModal from './components/BaoCao';
import TacNghiepView from './components/TacNghiep';
import PhanTichView  from './components/PhanTich';
import styles from './index.less';

moment.locale('vi');

const TRANG_THAI_LABEL: Record<string, string> = {
  [ETrangThaiTrucTiep.CHO_XAC_NHAN]:  'Chờ xác nhận',
  [ETrangThaiTrucTiep.DANG_CHE_BIEN]: 'Đang chế biến',
  [ETrangThaiTrucTiep.SAN_SANG]:      'Sẵn sàng',
  [ETrangThaiTrucTiep.HOAN_THANH]:    'Hoàn thành',
  da_huy: 'Đã huỷ',
};

const TongQuan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ETabKey>(ETabKey.TAC_NGHIEP);
  const [reportOpen, setReportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { orders, inventory } = useTongQuanModel();

  const tabs: { key: ETabKey; label: string }[] = [
    { key: ETabKey.TAC_NGHIEP, label: 'Tác nghiệp' },
    { key: ETabKey.PHAN_TICH,  label: 'Phân tích' },
  ];

  const handleExportExcel = () => {
    setExporting(true);
    try {
      const cancelledIds = new Set<string>();
      orders.forEach((o: any) => { if (o.trangthai === 'da_huy' || o.trangThai === 'da_huy') cancelledIds.add(o.maDon || o._id); });
      const active = orders.filter((o: any) => !cancelledIds.has(o.maDon || o._id));
      const today = moment().format('DD/MM/YYYY');

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
        [],
        ['CHỈ SỐ', 'GIÁ TRỊ'],
        ['Tổng đơn hôm nay', tongDon],
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
      const rows = orders.map((o: any) => {
        const dsMon = o.monan || o.monAn || [];
        const khTen = o.khachhang?.tenkhachhang || o.khachHang?.ten || '';
        const khPhong = o.khachhang?.phongban || o.khachHang?.phong || '';
        const tThai = o.trangthai || o.trangThai;
        return {
          'Mã đơn':      o.maDon || o._id,
          'KhachHang':  khTen,
          'Phòng ban':   khPhong,
          'Món ăn':      dsMon.map((m: any) => `${m.ten || m.tenmon} x${m.soLuong || m.soluong}`).join(', '),
          'Tổng tiền':   o.tongtien || o.tongTien,
          'Giờ đặt':     o.thoigiandat || o.thoiGian,
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

      const fileName = `BaoCao_CangTin_${moment().format('DDMMYYYY_HHmm')}.xlsx`;
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

          {activeTab === ETabKey.PHAN_TICH  && <PhanTichView orders={orders} />}
          {activeTab === ETabKey.TAC_NGHIEP && <TacNghiepView orders={orders} inventory={inventory} />}
      </div>

      <BaoCaoModal open={reportOpen} onClose={() => setReportOpen(false)} orders={orders} />
    </>
  );
};

export default TongQuan;
