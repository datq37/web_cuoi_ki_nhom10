import { DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('moment/locale/vi');
import * as XLSX from 'xlsx';
import Topbar from '@/pages/Quản Trị/Topbar';
import { fmt } from '@/models/Quản Trị/Tổng Quan';
import { mockData } from '@/services/Quản Trị/Tổng Quan';
import { ETrangThaiTrucTiep } from '@/services/Quản Trị/Tổng Quan/typing';
import { ETabKey } from '@/services/Quản Trị/Tổng Quan/typing';
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

  const tabs: { key: ETabKey; label: string }[] = [
    { key: ETabKey.TAC_NGHIEP, label: 'Tác nghiệp' },
    { key: ETabKey.PHAN_TICH,  label: 'Phân tích' },
  ];

  const handleExportExcel = () => {
    setExporting(true);
    try {
      const orders = store.get<typeof mockData.trucTiep.donHang>(KEYS.orders, mockData.trucTiep.donHang);
      const cancelledIds = new Set<string>();
      orders.forEach((o) => { if ((o.trangThai as any) === 'da_huy') cancelledIds.add(o.maDon); });
      const active = orders.filter((o) => !cancelledIds.has(o.maDon));
      const today = moment().format('DD/MM/YYYY');

      // ── Sheet 1: Tổng quan ─────────────────────────────────────────
      const tongDon    = active.length;
      const hoThanh    = active.filter((o) => o.trangThai === ETrangThaiTrucTiep.HOAN_THANH);
      const doanhThu   = hoThanh.reduce((s, o) => s + o.tongTien, 0);
      const choXacNhan = active.filter((o) => o.trangThai === ETrangThaiTrucTiep.CHO_XAC_NHAN).length;
      const dangLam    = active.filter((o) => o.trangThai === ETrangThaiTrucTiep.DANG_CHE_BIEN).length;
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
      const rows = orders.map((o) => ({
        'Mã đơn':      o.maDon,
        'Khách hàng':  o.khachHang.ten,
        'Phòng ban':   o.khachHang.phong ?? '',
        'Món ăn':      o.monAn.map((m) => `${m.ten} x${m.soLuong}`).join(', '),
        'Tổng tiền':   o.tongTien,
        'Giờ đặt':     o.thoiGian,
        'Trạng thái':  TRANG_THAI_LABEL[o.trangThai as string] ?? o.trangThai,
        'Ghi chú':     o.ghiChu ?? '',
      }));

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

          {activeTab === ETabKey.PHAN_TICH  && <PhanTichView />}
          {activeTab === ETabKey.TAC_NGHIEP && <TacNghiepView />}
      </div>

      <BaoCaoModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
};

export default TongQuan;
