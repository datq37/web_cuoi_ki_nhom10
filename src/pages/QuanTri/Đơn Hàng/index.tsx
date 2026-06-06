import {
  AppstoreOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { DatePicker, Input, Modal, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useMemo, useState } from 'react';
import { useNotif } from '@/context/NotifContext';
import Topbar from '@/pages/QuanTri/Topbar';
import PageToolbar from '@/pages/QuanTri/components/PageToolbar';
import EmptyState from '@/pages/QuanTri/components/EmptyState';
import { fmt } from '@/models/QuanTri/Tổng Quan';
import type { DonTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
import { ETrangThaiTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
import { useModel } from 'umi';
import { notifyCustomerOrderReady } from '@/utils/customerNotifications';
import OrderDrawer from './components/OrderDrawer';
import OrderKanban from './components/OrderKanban';
import OrderTable from './components/OrderTable';
import styles from './index.less';

type TabKey = 'tat_ca' | ETrangThaiTrucTiep | 'da_huy';

const TABS: { key: TabKey; label: string; dot?: string }[] = [
  { key: 'tat_ca', label: 'Tất cả' },
  { key: ETrangThaiTrucTiep.CHO_XAC_NHAN, label: 'Chờ xác nhận', dot: '#ea580c' },
  { key: ETrangThaiTrucTiep.DANG_CHE_BIEN, label: 'Đang chế biến', dot: '#2563eb' },
  { key: ETrangThaiTrucTiep.SAN_SANG, label: 'Sẵn sàng', dot: '#7c3aed' },
  { key: ETrangThaiTrucTiep.HOAN_THANH, label: 'Hoàn thành', dot: '#16a34a' },
  { key: 'da_huy', label: 'Đã huỷ', dot: '#9ca3af' },
];


// ── Component bảng lịch sử ───────────────────────────────────────
const LICH_SU_STATUS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  [ETrangThaiTrucTiep.HOAN_THANH]: { label: 'Hoàn thành', color: '#16a34a', icon: <CheckCircleOutlined /> },
  [ETrangThaiTrucTiep.DANG_CHE_BIEN]: { label: 'Đang chế biến', color: '#2563eb', icon: <ClockCircleOutlined /> },
  [ETrangThaiTrucTiep.CHO_XAC_NHAN]: { label: 'Chờ xác nhận', color: '#ea580c', icon: <ClockCircleOutlined /> },
  [ETrangThaiTrucTiep.SAN_SANG]: { label: 'Sẵn sàng', color: '#7c3aed', icon: <CheckCircleOutlined /> },
  da_huy: { label: 'Đã huỷ', color: '#9ca3af', icon: <CloseCircleOutlined /> },
};

const LichSuTable: React.FC<{
  orders: DonTrucTiep[];
  cancelledIds: Set<string>;
  onRowClick: (o: DonTrucTiep) => void;
}> = ({ orders, cancelledIds, onRowClick }) => {
  const columns: ColumnsType<DonTrucTiep> = [
    {
      title: 'Mã đơn',
      dataIndex: 'maDon',
      width: 110,
      render: (v: string) => <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>{v}</span>,
    },
    {
      title: 'Khách hàng',
      key: 'kh',
      render: (_: any, r: DonTrucTiep) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{r.khachHang.ten}</span>
          <span style={{ fontSize: 11.5, color: '#9ca3af' }}>{r.khachHang.phong}</span>
        </div>
      ),
    },
    {
      title: 'Món ăn',
      key: 'mon',
      render: (_: any, r: DonTrucTiep) => (
        <span style={{ fontSize: 12.5, color: '#6b7280' }}>
          {r.monAn.map((m) => `${m.ten} ×${m.soLuong}`).join(', ')}
        </span>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tongTien',
      width: 110,
      align: 'right',
      render: (v: number) => <span style={{ fontWeight: 700, color: '#16a34a' }}>{fmt(v)}</span>,
    },
    {
      title: 'Giờ',
      dataIndex: 'thoiGian',
      width: 75,
      render: (v: string) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{v}</span>,
    },
    {
      title: 'Trạng thái',
      width: 140,
      render: (_: any, r: DonTrucTiep) => {
        const key = cancelledIds.has(r.maDon) ? 'da_huy' : r.trangThai as string;
        const cfg = LICH_SU_STATUS[key] ?? LICH_SU_STATUS['da_huy'];
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 600, color: cfg.color }}>
            {cfg.icon} {cfg.label}
          </span>
        );
      },
    },
  ];

  return (
    <Table<DonTrucTiep>
      dataSource={orders}
      columns={columns}
      rowKey="maDon"
      size="small"
      pagination={{ pageSize: 15, showTotal: (t) => `${t} đơn`, showSizeChanger: false }}
      onRow={(r) => ({ onClick: () => onRowClick(r), style: { cursor: 'pointer' } })}
      locale={{ emptyText: 'Không có đơn nào trong ngày này' }}
    />
  );
};

const DonHang: React.FC = () => {
  const { addNotif } = useNotif();

  const {
    orders = [],
    cancelledIds = new Set<string>(),
    tabCounts = { tat_ca: 0, [ETrangThaiTrucTiep.CHO_XAC_NHAN]: 0, [ETrangThaiTrucTiep.DANG_CHE_BIEN]: 0, [ETrangThaiTrucTiep.SAN_SANG]: 0, [ETrangThaiTrucTiep.HOAN_THANH]: 0, da_huy: 0 },
    moveStatus = () => { },
    confirmBankingPayment = async () => null,
    fetchOrders = () => { }
  } = useModel('QuanTri.Đơn Hàng.index') || {};

  // ── UI state (cục bộ) ─────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<'homnay' | 'lichsu'>('homnay');
  const [activeTab, setActiveTab] = useState<TabKey>('tat_ca');
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [searchKw, setSearchKw] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<DonTrucTiep | null>(null);
  const [paymentConfirming, setPaymentConfirming] = useState(false);

  // ── Lịch sử state ────────────────────────────────────────────────
  const [lichSuDate, setLichSuDate] = useState<any>(moment());
  const [lichSuSearch, setLichSuSearch] = useState('');

  // Đơn lịch sử: hoàn thành + đã huỷ (dùng tất cả orders làm demo)
  const lichSuOrders = useMemo(() => {
    let list = [...orders];
    if (lichSuSearch.trim()) {
      const kw = lichSuSearch.toLowerCase();
      list = list.filter((o) =>
        o.maDon.toLowerCase().includes(kw) ||
        o.khachHang.ten.toLowerCase().includes(kw) ||
        o.monAn.some((m) => m.ten.toLowerCase().includes(kw)),
      );
    }
    return list;
  }, [orders, lichSuSearch]);

  // stats và tabCounts đã lấy từ useModel phía trên

  // ── Filtered orders ──────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    // Nếu không phải hôm nay → không có đơn (mock chỉ có dữ liệu hôm nay)

    let list =
      activeTab === 'da_huy'
        ? orders.filter((o) => cancelledIds.has(o.maDon))
        : orders.filter((o) => !cancelledIds.has(o.maDon));

    if (activeTab !== 'tat_ca' && activeTab !== 'da_huy') {
      list = list.filter((o) => o.trangThai === activeTab);
    }

    if (searchKw.trim()) {
      const kw = searchKw.toLowerCase();
      list = list.filter(
        (o) =>
          o.maDon.toLowerCase().includes(kw) ||
          o.khachHang.ten.toLowerCase().includes(kw) ||
          o.monAn.some((m) => m.ten.toLowerCase().includes(kw)),
      );
    }
    return list;
  }, [orders, activeTab, searchKw, cancelledIds]);

  // ── Handlers ─────────────────────────────────────────────────────
  const handleMoveStatus = async (
    maDon: string,
    newStatus: ETrangThaiTrucTiep | 'da_huy',
    silent = false,
  ) => {
    try {
      await moveStatus(maDon, newStatus);
    } catch (error) {
      return;
    }

    // Cập nhật selectedOrder nếu cần
    if (newStatus === 'da_huy') {
      setSelectedOrder((prev) => prev?.maDon === maDon ? null : prev);
    } else {
      setSelectedOrder((prev) => prev?.maDon === maDon ? { ...prev, trangThai: newStatus as any } : prev);
    }

    if (!silent) {
      if (newStatus === 'da_huy') {
        message.success(`Đã huỷ đơn ${maDon}`);
        addNotif({ icon: '❌', title: `Đơn ${maDon} đã bị huỷ`, desc: 'Huỷ bởi quản trị viên', type: 'order_cancelled' });
      } else {
        message.success(`Đã cập nhật đơn ${maDon}`);
        const notifMap: Record<ETrangThaiTrucTiep, { icon: string; title: string; desc: string; type: any }> = {
          [ETrangThaiTrucTiep.DANG_CHE_BIEN]: { icon: '🍳', title: `Đơn ${maDon} đang chế biến`, desc: 'Bếp đã nhận đơn', type: 'order_cooking' },
          [ETrangThaiTrucTiep.SAN_SANG]: { icon: '📦', title: `Đơn ${maDon} sẵn sàng`, desc: 'Chờ giao cho khách', type: 'order_ready' },
          [ETrangThaiTrucTiep.HOAN_THANH]: { icon: '✅', title: `Đơn ${maDon} hoàn thành`, desc: 'Khách đã nhận đơn', type: 'order_done' },
          [ETrangThaiTrucTiep.CHO_XAC_NHAN]: { icon: '🛒', title: `Đơn ${maDon} chờ xác nhận`, desc: 'Đang chờ', type: 'order_pending' },
        };
        if (notifMap[newStatus as ETrangThaiTrucTiep]) addNotif(notifMap[newStatus as ETrangThaiTrucTiep]);
        if (newStatus === ETrangThaiTrucTiep.SAN_SANG) notifyCustomerOrderReady(maDon);
      }
    }
  };

  const handleCancelOrder = (maDon: string) => {
    Modal.confirm({
      title: 'Huỷ đơn hàng?',
      content: `Xác nhận huỷ đơn ${maDon}? Hành động không thể hoàn tác.`,
      okType: 'danger', okText: 'Huỷ đơn', cancelText: 'Không', centered: true,
      okButtonProps: { style: { borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk: () => handleMoveStatus(maDon, 'da_huy'),
    });
  };

  const handleConfirmPayment = async (maDon: string) => {
    try {
      setPaymentConfirming(true);
      const updatedOrder = await confirmBankingPayment(maDon);
      if (updatedOrder) {
        setSelectedOrder((prev) => (prev?.maDon === maDon ? updatedOrder : prev));
      } else {
        await fetchOrders();
      }
      message.success(`Đã xác nhận chuyển khoản cho đơn ${maDon}`);
    } finally {
      setPaymentConfirming(false);
    }
  };


  const handlePrint = (order: DonTrucTiep) => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <!DOCTYPE html><html><head>
        <title>Phiếu bếp - ${order.maDon}</title>
        <style>
          body{font-family:'Courier New',monospace;width:280px;margin:0 auto;padding:16px;font-size:13px}
          .c{text-align:center}.b{font-weight:bold}.big{font-size:17px;font-weight:bold}
          .dash{border-top:1px dashed #000;margin:8px 0}
          .row{display:flex;justify-content:space-between;margin:3px 0}
          @media print{body{width:100%}}
        </style>
      </head><body>
        <div class="c big">CĂNG TIN</div>
        <div class="c" style="font-size:11px">Toà nhà A</div>
        <div class="dash"></div>
        <div class="row"><span>Mã đơn:</span><span class="b">${order.maDon}</span></div>
        <div class="row"><span>Thời gian:</span><span>${order.thoiGian}</span></div>
        <div class="row"><span>Khách hàng:</span><span>${order.khachHang.ten}</span></div>
        <div class="dash"></div>
        <div class="b">MÓN ĂN:</div>
        ${order.monAn.map((m) => `<div class="row"><span>${m.ten}</span><span>×${m.soLuong}</span></div>`).join('')}
        <div class="dash"></div>
        ${order.ghiChu ? `<div>GHI CHÚ: <b>${order.ghiChu}</b></div><div class="dash"></div>` : ''}
        <div class="row b"><span>TỔNG TIỀN:</span><span>${fmt(order.tongTien)}</span></div>
        <div class="dash"></div>
        <div class="c" style="font-size:10px;margin-top:8px">Cảm ơn quý khách!</div>
      </body></html>
    `);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 300);
  };

  return (
    <>
      <Topbar title="Quản lý đơn hàng" />

      <div className={styles.pageBody}>

        {/* ── Outer tabs: Hôm nay / Lịch sử ───────────────────── */}
        <div className={styles.outerTabsRow}>
          <button
            className={`${styles.outerTabBtn} ${viewMode === 'homnay' ? styles.outerTabActive : ''}`}
            onClick={() => setViewMode('homnay')}
          >
            <CalendarOutlined style={{ marginRight: 6 }} />
            Hôm nay
          </button>
          <button
            className={`${styles.outerTabBtn} ${viewMode === 'lichsu' ? styles.outerTabActive : ''}`}
            onClick={() => setViewMode('lichsu')}
          >
            <HistoryOutlined style={{ marginRight: 6 }} />
            Lịch sử đơn hàng
          </button>
        </div>

        {/* ════════ TAB HÔM NAY ════════ */}
        {viewMode === 'homnay' && (
          <>
            {/* ── Tabs ─────────────────────────────────────────────── */}
            <div className={styles.tabsRow}>
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.dot && (
                    <span className={styles.tabDot} style={{ background: tab.dot }} />
                  )}
                  {tab.label}
                  {tabCounts[tab.key] > 0 && (
                    <span className={styles.tabCount}>{tabCounts[tab.key]}</span>
                  )}
                </button>
              ))}
            </div>

            {/* ── Toolbar ──────────────────────────────────────────── */}
            <PageToolbar
              searchPlaceholder="Tìm mã đơn, tên khách, tên món..."
              searchValue={searchKw}
              onSearch={setSearchKw}
              filters={
                <div className={styles.viewToggle}>
                  <button className={`${styles.toggleBtn} ${view === 'table' ? styles.toggleActive : ''}`} onClick={() => setView('table')} title="Dạng bảng"><UnorderedListOutlined /></button>
                  <button className={`${styles.toggleBtn} ${view === 'kanban' ? styles.toggleActive : ''}`} onClick={() => setView('kanban')} title="Dạng kanban"><AppstoreOutlined /></button>
                </div>
              }
              actions={undefined}
            />

            {/* ── Content ──────────────────────────────────────────── */}
            {filteredOrders.length === 0 ? (
              <EmptyState
                kind="orders"
                desc="Chưa có đơn hàng nào."
              />
            ) : view === 'table' ? (
              <OrderTable
                orders={filteredOrders}
                onRowClick={setSelectedOrder}
                cancelledIds={cancelledIds}
                searchValue={searchKw}
                onQuickConfirm={(maDon) => handleMoveStatus(maDon, ETrangThaiTrucTiep.DANG_CHE_BIEN)}
              />
            ) : (
              <OrderKanban
                orders={filteredOrders}
                cancelledIds={cancelledIds}
                onCardClick={setSelectedOrder}
                onMoveStatus={handleMoveStatus}
              />
            )}
          </>
        )}

        {/* ════════ TAB LỊCH SỬ ════════ */}
        {viewMode === 'lichsu' && (
          <div className={styles.lichSuWrap}>
            {/* Toolbar lịch sử */}
            <div className={styles.lichSuToolbar}>
              <DatePicker
                value={lichSuDate}
                onChange={(d) => setLichSuDate(d)}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày"
                style={{ width: 160, borderRadius: 8 }}
                allowClear={false}
              />
              <Input
                prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                placeholder="Tìm mã đơn, tên khách, tên món..."
                value={lichSuSearch}
                onChange={(e) => setLichSuSearch(e.target.value)}
                allowClear
                style={{ width: 300, borderRadius: 8 }}
              />
              <span className={styles.lichSuCount}>
                {lichSuOrders.length} đơn
              </span>
            </div>

            {/* Bảng lịch sử */}
            <LichSuTable
              orders={lichSuOrders}
              cancelledIds={cancelledIds}
              onRowClick={setSelectedOrder}
            />
          </div>
        )}

      </div>

      <OrderDrawer
        order={selectedOrder}
        cancelledIds={cancelledIds}
        onClose={() => setSelectedOrder(null)}
        onMoveStatus={handleMoveStatus}
        onCancel={handleCancelOrder}
        onConfirmPayment={handleConfirmPayment}
        onPrint={handlePrint}
        paymentConfirming={paymentConfirming}
      />
    </>
  );
};

export default DonHang;
