import {
  AppstoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  FireOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Input, Modal, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useMemo, useState, useEffect } from 'react';
import { useNotif } from '@/context/NotifContext';
import Topbar from '@/pages/Quản Trị/Topbar';
import PageToolbar from '@/pages/Quản Trị/components/PageToolbar';
import EmptyState from '@/pages/Quản Trị/components/EmptyState';
import { fmt } from '@/models/Quản Trị/Tổng Quan';
import { mockData } from '@/services/Quản Trị/Tổng Quan';
import type { DonTrucTiep } from '@/services/Quản Trị/Tổng Quan/typing';
import { ETrangThaiTrucTiep } from '@/services/Quản Trị/Tổng Quan/typing';
import OrderDrawer from './components/OrderDrawer';
import OrderKanban from './components/OrderKanban';
import OrderTable from './components/OrderTable';
import styles from './index.less';

type TabKey = 'tat_ca' | ETrangThaiTrucTiep | 'da_huy';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'tat_ca',                         label: 'Tất cả'        },
  { key: ETrangThaiTrucTiep.CHO_XAC_NHAN, label: 'Chờ xác nhận' },
  { key: ETrangThaiTrucTiep.DANG_CHE_BIEN, label: 'Đang chế biến'},
  { key: ETrangThaiTrucTiep.SAN_SANG,      label: 'Sẵn sàng'     },
  { key: ETrangThaiTrucTiep.HOAN_THANH,   label: 'Hoàn thành'   },
  { key: 'da_huy',                         label: 'Đã huỷ'       },
];

const TODAY = dayjs().format('DD/MM/YYYY');

const DonHang: React.FC = () => {
  const { addNotif } = useNotif();

  const [orders, setOrders] = useState<DonTrucTiep[]>(() => {
    try {
      const saved = localStorage.getItem('admin_orders');
      if (saved) { const list = JSON.parse(saved); if (Array.isArray(list) && list.length > 0) return list; }
      else { localStorage.setItem('admin_orders', JSON.stringify(mockData.trucTiep.donHang)); }
    } catch { /* */ }
    return mockData.trucTiep.donHang;
  });

  useEffect(() => { localStorage.setItem('admin_orders', JSON.stringify(orders)); window.dispatchEvent(new Event('admin_orders_updated')); }, [orders]);

  useEffect(() => {
    const h = () => {
      const saved = localStorage.getItem('admin_orders');
      if (!saved) return;
      try {
        const list = JSON.parse(saved);
        if (!Array.isArray(list)) return;
        setOrders((p) => JSON.stringify(p) === saved ? p : list);
        setCancelledIds(() => { const s = new Set<string>(); list.forEach((o: DonTrucTiep) => { if ((o.trangThai as any) === 'da_huy') s.add(o.maDon); }); return s; });
      } catch { /* */ }
    };
    window.addEventListener('storage', h); window.addEventListener('focus', h);
    return () => { window.removeEventListener('storage', h); window.removeEventListener('focus', h); };
  }, []);

  const [cancelledIds, setCancelledIds] = useState<Set<string>>(() => {
    const s = new Set<string>(); mockData.trucTiep.donHang.forEach((o) => { if ((o.trangThai as any) === 'da_huy') s.add(o.maDon); }); return s;
  });

  const stats = useMemo(() => {
    const active = orders.filter((o) => !cancelledIds.has(o.maDon));
    const choXacNhan = active.filter((o) => o.trangThai === ETrangThaiTrucTiep.CHO_XAC_NHAN).length;
    const dangCheBien = active.filter((o) => o.trangThai === ETrangThaiTrucTiep.DANG_CHE_BIEN).length;
    const doanhThu = active.filter((o) => o.trangThai === ETrangThaiTrucTiep.HOAN_THANH).reduce((s, o) => s + o.tongTien, 0);
    return { tong: active.length, choXacNhan, dangCheBien, doanhThu };
  }, [orders, cancelledIds]);

  const tabCounts = useMemo<Record<string, number>>(() => {
    const active = orders.filter((o) => !cancelledIds.has(o.maDon));
    return {
      tat_ca: active.length,
      [ETrangThaiTrucTiep.CHO_XAC_NHAN]: active.filter((o) => o.trangThai === ETrangThaiTrucTiep.CHO_XAC_NHAN).length,
      [ETrangThaiTrucTiep.DANG_CHE_BIEN]: active.filter((o) => o.trangThai === ETrangThaiTrucTiep.DANG_CHE_BIEN).length,
      [ETrangThaiTrucTiep.SAN_SANG]: active.filter((o) => o.trangThai === ETrangThaiTrucTiep.SAN_SANG).length,
      [ETrangThaiTrucTiep.HOAN_THANH]: active.filter((o) => o.trangThai === ETrangThaiTrucTiep.HOAN_THANH).length,
      da_huy: cancelledIds.size,
    };
  }, [orders, cancelledIds]);

  // ── UI state (cục bộ) ─────────────────────────────────────────────
  const [activeTab,     setActiveTab]     = useState<TabKey>('tat_ca');
  const [view,          setView]          = useState<'table' | 'kanban'>('table');
  const [searchKw,      setSearchKw]      = useState('');
  const [selectedRows,  setSelectedRows]  = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DonTrucTiep | null>(null);
  const [filterDate,    setFilterDate]    = useState<Dayjs>(dayjs());

  const isToday = filterDate.format('DD/MM/YYYY') === TODAY;

  // stats và tabCounts đã lấy từ useModel phía trên

  // ── Filtered orders ──────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    // Nếu không phải hôm nay → không có đơn (mock chỉ có dữ liệu hôm nay)
    if (!isToday) return [];

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
          o.khachHang.ten.toLowerCase().includes(kw),
      );
    }
    return list;
  }, [orders, activeTab, searchKw, cancelledIds, isToday]);

  // ── Handlers ─────────────────────────────────────────────────────
  const handleMoveStatus = (
    maDon: string,
    newStatus: ETrangThaiTrucTiep | 'da_huy',
    silent = false,
  ) => {
    if (newStatus === 'da_huy') setCancelledIds((prev) => new Set([...prev, maDon]));
    setOrders((prev) => prev.map((o) => o.maDon === maDon ? { ...o, trangThai: newStatus as any } : o));
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
          [ETrangThaiTrucTiep.SAN_SANG]:      { icon: '📦', title: `Đơn ${maDon} sẵn sàng`,      desc: 'Chờ giao cho khách', type: 'order_ready' },
          [ETrangThaiTrucTiep.HOAN_THANH]:    { icon: '✅', title: `Đơn ${maDon} hoàn thành`,    desc: 'Khách đã nhận đơn', type: 'order_done' },
          [ETrangThaiTrucTiep.CHO_XAC_NHAN]: { icon: '🛒', title: `Đơn ${maDon} chờ xác nhận`, desc: 'Đang chờ', type: 'order_pending' },
        };
        if (notifMap[newStatus as ETrangThaiTrucTiep]) addNotif(notifMap[newStatus as ETrangThaiTrucTiep]);
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

  const handleBulkAction = (action: 'confirm' | 'done' | 'cancel') => {
    const statusMap: Record<string, ETrangThaiTrucTiep | 'da_huy'> = {
      confirm: ETrangThaiTrucTiep.DANG_CHE_BIEN,
      done:    ETrangThaiTrucTiep.HOAN_THANH,
      cancel:  'da_huy',
    };
    const newStatus = statusMap[action];
    const eligibleRows = action === 'confirm'
      ? selectedRows.filter((id) => orders.find((o) => o.maDon === id)?.trangThai === ETrangThaiTrucTiep.CHO_XAC_NHAN)
      : selectedRows;
    if (eligibleRows.length === 0) { message.warning('Không có đơn nào đủ điều kiện.'); return; }
    if (eligibleRows.length < selectedRows.length) message.info(`Chỉ ${eligibleRows.length}/${selectedRows.length} đơn đủ điều kiện.`);
    if (newStatus === 'da_huy') { setCancelledIds((prev) => new Set([...prev, ...eligibleRows])); }
    setOrders((prev) => prev.map((o) => eligibleRows.includes(o.maDon) ? { ...o, trangThai: newStatus as any } : o));
    message.success(`Đã ${action === 'cancel' ? 'huỷ' : 'cập nhật'} ${eligibleRows.length} đơn`);
    setSelectedRows([]);
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

        {/* ── Stat cards ───────────────────────────────────────── */}
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLeft}>
              <div className={styles.statLabel}>TỔNG ĐƠN HÔM NAY</div>
              <div className={styles.statValue}>{stats.tong}</div>
            </div>
            <div className={styles.statIconWrap} style={{ background: '#dcfce7' }}>
              <ShoppingCartOutlined style={{ fontSize: 20, color: '#16a34a' }} />
            </div>
          </div>

          <div className={`${styles.statCard} ${stats.choXacNhan > 0 ? styles.statCardAlert : ''}`}>
            <div className={styles.statLeft}>
              <div className={styles.statLabel}>CHỜ XÁC NHẬN</div>
              <div className={styles.statValue}>{stats.choXacNhan}</div>
              {stats.choXacNhan > 0 && (
                <div className={styles.statSub} style={{ color: '#ea580c' }}>Cần xử lý ngay</div>
              )}
            </div>
            <div className={styles.statIconWrap} style={{ background: stats.choXacNhan > 0 ? '#ffedd5' : '#f3f4f6' }}>
              <ClockCircleOutlined style={{ fontSize: 20, color: stats.choXacNhan > 0 ? '#ea580c' : '#9ca3af' }} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLeft}>
              <div className={styles.statLabel}>ĐANG CHẾ BIẾN</div>
              <div className={styles.statValue}>{stats.dangCheBien}</div>
            </div>
            <div className={styles.statIconWrap} style={{ background: '#eff6ff' }}>
              <FireOutlined style={{ fontSize: 20, color: '#3b82f6' }} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLeft}>
              <div className={styles.statLabel}>DOANH THU HÔM NAY</div>
              <div className={styles.statValue} style={{ fontSize: 20 }}>{fmt(stats.doanhThu)}</div>
            </div>
            <div className={styles.statIconWrap} style={{ background: '#dcfce7' }}>
              <WalletOutlined style={{ fontSize: 20, color: '#16a34a' }} />
            </div>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────── */}
        <div className={styles.tabsRow}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tabCounts[tab.key] > 0 && (
                <span className={styles.tabCount}>{tabCounts[tab.key]}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Toolbar ──────────────────────────────────────────── */}
        <PageToolbar
          searchPlaceholder="Tìm theo mã đơn, tên khách..."
          searchValue={searchKw}
          onSearch={setSearchKw}
          filters={
            <>
              <DatePicker
                value={filterDate}
                onChange={(d) => d && setFilterDate(d)}
                format="DD/MM/YYYY"
                allowClear={false}
                className={styles.datePicker}
                placeholder="Chọn ngày"
              />
              {!isToday && (
                <Button size="small" onClick={() => setFilterDate(dayjs())} className={styles.btnResetDate}>
                  Hôm nay
                </Button>
              )}
            </>
          }
          actions={
            <div className={styles.viewToggle}>
              <button className={`${styles.toggleBtn} ${view === 'table' ? styles.toggleActive : ''}`} onClick={() => setView('table')} title="Dạng bảng"><UnorderedListOutlined /></button>
              <button className={`${styles.toggleBtn} ${view === 'kanban' ? styles.toggleActive : ''}`} onClick={() => setView('kanban')} title="Dạng kanban"><AppstoreOutlined /></button>
            </div>
          }
        />

        {/* ── Bulk bar ─────────────────────────────────────────── */}
        {selectedRows.length > 0 && (
          <div className={styles.bulkBar}>
            <span className={styles.bulkCount}>
              Đã chọn <strong>{selectedRows.length}</strong> đơn
            </span>
            <div className={styles.bulkActions}>
              <Button size="small" type="primary" onClick={() => handleBulkAction('confirm')}>
                Xác nhận
              </Button>
              <Button size="small" onClick={() => handleBulkAction('done')}>
                Hoàn tất
              </Button>
              <Button size="small" danger onClick={() => handleBulkAction('cancel')}>
                Huỷ
              </Button>
              <button className={styles.bulkClear} onClick={() => setSelectedRows([])} title="Bỏ chọn">
                <CloseOutlined />
              </button>
            </div>
          </div>
        )}

        {/* ── Content ──────────────────────────────────────────── */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            kind="orders"
            title={!isToday ? `Không có đơn ngày ${filterDate.format('DD/MM/YYYY')}` : undefined}
            desc={!isToday ? 'Dữ liệu lịch sử chưa được lưu trữ.' : 'Chưa có đơn hàng nào.'}
            action={!isToday ? { label: 'Về hôm nay', onClick: () => setFilterDate(dayjs()) } : undefined}
          />
        ) : view === 'table' ? (
          <OrderTable
            orders={filteredOrders}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            onRowClick={setSelectedOrder}
            cancelledIds={cancelledIds}
          />
        ) : (
          <OrderKanban
            orders={filteredOrders}
            cancelledIds={cancelledIds}
            onCardClick={setSelectedOrder}
            onMoveStatus={handleMoveStatus}
          />
        )}
      </div>

      <OrderDrawer
        order={selectedOrder}
        cancelledIds={cancelledIds}
        onClose={() => setSelectedOrder(null)}
        onMoveStatus={handleMoveStatus}
        onCancel={handleCancelOrder}
        onPrint={handlePrint}
      />
    </>
  );
};

export default DonHang;
