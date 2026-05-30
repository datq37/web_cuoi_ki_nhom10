import { CloseOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import moment from 'moment';
import React, { useRef } from 'react';
import { mockData } from '@/services/Quản Trị/Tổng Quan';
import styles from './index.less';

interface Props {
  open: boolean;
  onClose: () => void;
}

const PRINT_STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Times New Roman', Times, serif; padding: 18mm 15mm; color: #1e293b; font-size: 13px; }
.rpt-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 14px; border-bottom: 2px solid #0f172a; margin-bottom: 20px; }
.rpt-header-left { display: flex; gap: 12px; align-items: center; }
.rpt-logo { width: 42px; height: 42px; background: #16a34a; border-radius: 8px; color: #fff; font-size: 14px; font-weight: 700; display: table-cell; text-align: center; vertical-align: middle; font-family: sans-serif; }
.rpt-company-name { font-size: 14px; font-weight: 700; }
.rpt-company-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
.rpt-header-right { text-align: right; }
.rpt-title { font-size: 15px; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase; }
.rpt-sub { font-size: 11px; color: #64748b; margin-top: 3px; }
.rpt-stat-row { display: flex; gap: 10px; margin-bottom: 22px; }
.rpt-stat-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; }
.rpt-stat-label { font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 4px; }
.rpt-stat-value { font-size: 18px; font-weight: 700; color: #0f172a; }
.rpt-stat-change { font-size: 9px; color: #16a34a; margin-top: 3px; font-weight: 500; }
.rpt-section { margin-bottom: 22px; }
.rpt-section-title { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 8px; padding-left: 10px; border-left: 3px solid #16a34a; }
table.rpt-table { width: 100%; border-collapse: collapse; font-size: 12px; }
table.rpt-table th { background: #f1f5f9; padding: 7px 10px; text-align: left; font-size: 10px; font-weight: 700; color: #475569; border: 1px solid #e2e8f0; text-transform: uppercase; letter-spacing: 0.3px; }
table.rpt-table td { padding: 7px 10px; color: #374151; border: 1px solid #e2e8f0; vertical-align: middle; }
table.rpt-table tbody tr:nth-child(even) td { background: #f8fafc; }
.td-c { text-align: center; } .td-r { text-align: right; } .td-bold { font-weight: 600; color: #0f172a; } .td-green { color: #16a34a; font-weight: 500; } .td-rank { text-align: center; font-weight: 700; color: #16a34a; }
.rpt-footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-end; }
.rpt-footer-note { font-size: 10px; color: #94a3b8; }
.rpt-sign-box { text-align: center; min-width: 140px; }
.rpt-sign-title { font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 36px; }
.rpt-sign-line { border-top: 1px solid #475569; margin: 0 8px 4px; }
.rpt-sign-name { font-size: 11px; color: #374151; }
`;

const BaoCaoModal: React.FC<Props> = ({ open, onClose }) => {
  const { banners, topMon, donTheoTrangThai, hieuSuat } = mockData.phanTich;
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    const win = window.open('', '_blank', 'width=880,height=720');
    if (!win) return;
    win.document.write(
      `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8">` +
      `<title>Báo cáo tổng quan ${moment().format('DD/MM/YYYY')}</title>` +
      `<style>${PRINT_STYLES}</style></head>` +
      `<body>${printRef.current.innerHTML}` +
      `<script>window.onload=function(){window.print();setTimeout(function(){window.close();},800);}<\/script>` +
      `</body></html>`,
    );
    win.document.close();
  };

  return (
    <Modal
      visible={open}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      className={styles.baoCaoModal}
      closable={false}
      title={null}
    >
      <div className={styles.actionBar}>
        <div className={styles.barLeft}>
          <span className={styles.modalTitle}>Xem trước báo cáo</span>
          <span className={styles.modalSub}>· {moment().format('DD/MM/YYYY HH:mm')}</span>
        </div>
        <div className={styles.barRight}>
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={handlePrint}
            className={styles.printBtn}
          >
            In báo cáo
          </Button>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>
      </div>
      <div className={styles.paperViewport}>
        <div className={styles.paper}>
          <div ref={printRef}>
            <div className="rpt-header">
              <div className="rpt-header-left">
                <div className="rpt-logo">CT</div>
                <div>
                  <div className="rpt-company-name">Căng Tin Toà Nhà A</div>
                  <div className="rpt-company-sub">Địa chỉ: Tầng 1, Toà nhà A</div>
                </div>
              </div>
              <div className="rpt-header-right">
                <div className="rpt-title">Báo cáo tổng quan kinh doanh</div>
                <div className="rpt-sub">Ngày: {moment().format('DD/MM/YYYY')}</div>
                <div className="rpt-sub">Giờ tạo: {moment().format('HH:mm')}</div>
              </div>
            </div>
            <div className="rpt-stat-row">
              {banners.map((b) => (
                <div key={b.id} className="rpt-stat-card">
                  <div className="rpt-stat-label">{b.label}</div>
                  <div className="rpt-stat-value">{b.value}</div>
                  <div className="rpt-stat-change">{b.change}</div>
                </div>
              ))}
            </div>
            <div className="rpt-section">
              <div className="rpt-section-title">I. Top món bán chạy</div>
              <table className="rpt-table">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}>STT</th>
                    <th>Tên món</th>
                    <th style={{ width: 100 }}>Đã bán</th>
                    <th style={{ width: 130 }}>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {topMon.map((m) => (
                    <tr key={m.rank}>
                      <td className="td-rank">{m.rank}</td>
                      <td className="td-bold">{m.ten}</td>
                      <td className="td-c">{m.daBan} {m.donVi}</td>
                      <td className="td-r td-green">{m.doanhThu.toLocaleString('vi-VN')}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rpt-section">
              <div className="rpt-section-title">II. Đơn hàng theo trạng thái</div>
              <table className="rpt-table">
                <thead>
                  <tr>
                    <th>Trạng thái</th>
                    <th style={{ width: 80 }}>Số đơn</th>
                    <th style={{ width: 80 }}>Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody>
                  {donTheoTrangThai.map((t) => (
                    <tr key={t.key}>
                      <td>{t.ten}</td>
                      <td className="td-c td-bold">{t.soDon}</td>
                      <td className="td-c">{t.tyLe}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rpt-section">
              <div className="rpt-section-title">III. Hiệu suất phục vụ</div>
              <table className="rpt-table">
                <thead>
                  <tr>
                    <th>Chỉ số</th>
                    <th style={{ width: 110 }}>Giá trị</th>
                    <th>So sánh</th>
                  </tr>
                </thead>
                <tbody>
                  {hieuSuat.map((h, i) => (
                    <tr key={i}>
                      <td>{h.label}</td>
                      <td className="td-bold">{h.value}{h.unit}</td>
                      <td className="td-green">{h.change} {h.changeDetail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rpt-footer">
              <div className="rpt-footer-note">
                Tạo tự động lúc {moment().format('HH:mm DD/MM/YYYY')}
              </div>
              <div className="rpt-sign-box">
                <div className="rpt-sign-title">Người lập báo cáo</div>
                <div className="rpt-sign-line" />
                <div className="rpt-sign-name">Admin</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BaoCaoModal;
