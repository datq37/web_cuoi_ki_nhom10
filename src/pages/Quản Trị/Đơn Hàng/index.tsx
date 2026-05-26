import {
  AppstoreOutlined,
  CloseOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Input, Modal, message } from 'antd';
import React, { useMemo, useState, useEffect } from 'react';
import Sidebar from '@/pages/Quản Trị/Sidebar';
import Topbar from '@/pages/Quản Trị/Topbar';
import { fmt } from '@/models/Quản Trị/Tổng Quan';
import { mockData } from '@/services/Quản Trị/Tổng Quan';
import type { DonTrucTiep } from '@/services/Quản Trị/Tổng Quan/typing';
import { ETrangThaiTrucTiep } from '@/services/Quản Trị/Tổng Quan/typing';
import OrderDrawer from './components/OrderDrawer';
import OrderKanban from './components/OrderKanban';
import OrderTable from './components/OrderTable';
import styles from './index.less';

// ── Types ─────────────────────────────────────────────────────────
type TabKey = 'tat_ca' | ETrangThaiTrucTiep | 'da_huy';

// ── Constants ─────────────────────────────────────────────────────
const TABS: { key: TabKey; label: string }[] = [
  { key: 'tat_ca',                          label: 'Tất cả'         },
  { key: ETrangThaiTrucTiep.CHO_XAC_NHAN,  label: 'Chờ xác nhận'  },
  { key: ETrangThaiTrucTiep.DANG_CHE_BIEN,  label: 'Đang chế biến' },
  { key: ETrangThaiTrucTiep.SAN_SANG,       label: 'Sẵn sàng'      },
  { key: ETrangThaiTrucTiep.HOAN_THANH,     label: 'Hoàn thành'    },
  { key: 'da_huy',                           label: 'Đã huỷ'        },
];

// ── Component ─────────────────────────────────────────────────────
const DonHang: React.FC = () => {
  const [orders, setOrders] = useState<DonTrucTiep[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_orders');
      if (saved) {
        try {
          const list = JSON.parse(saved);
          if (Array.isArray(list) && list.length > 0) return list;
        } catch { /* ignore */ }
      } else {
        // Init if empty
        localStorage.setItem('admin_orders', JSON.stringify(mockData.trucTiep.donHang));
      }
    }
    return mockData.trucTiep.donHang;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_orders', JSON.stringify(orders));
      window.dispatchEvent(new Event('admin_orders_updated'));
    }
  }, [orders]);

  useEffect(() => {
    const handleStorage = (e?: Event) => {
      // Dùng storage event để đồng bộ giữa các tab.
      const saved = localStorage.getItem('admin_orders');
      if (saved) {
        try {
          const list = JSON.parse(saved);
          if (Array.isArray(list)) {
            setOrders((prev) => {
              if (JSON.stringify(prev) === saved) return prev; // Avoid infinite loop!
              return list;
            });
            setCancelledIds((prevIds) => {
              const newSet = new Set<string>();
              list.forEach(o => {
                if (o.trangThai === ('da_huy' as any)) newSet.add(o.maDon);
              });
              if (prevIds.size === newSet.size) return prevIds;
              return newSet;
            });
          }
        } catch { /* ignore */ }
      }
    };
    
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleStorage);
    };
  }, []);

  const [cancelledIds, setCancelledIds] = useState<Set<string>>(() => {
    const set = new Set<string>();
    orders.forEach(o => {
      if (o.trangThai === ('da_huy' as any)) set.add(o.maDon);
    });
    return set;
  });
  const [activeTab,    setActiveTab]    = useState<TabKey>('tat_ca');
  const [view,         setView]         = useState<'table' | 'kanban'>('table');
  const [searchKw,     setSearchKw]     = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DonTrucTiep | null>(null);

  // ── Tab counts ──────────────────────────────────────────────────
  const tabCounts = useMemo<Record<string, number>>(() => {
    const active = orders.filter((o) => !cancelledIds.has(o.maDon));
    return {
      tat_ca:                              active.length,
      [ETrangThaiTrucTiep.CHO_XAC_NHAN]:  active.filter((o) => o.trangThai === ETrangThaiTrucTiep.CHO_XAC_NHAN).length,
      [ETrangThaiTrucTiep.DANG_CHE_BIEN]: active.filter((o) => o.trangThai === ETrangThaiTrucTiep.DANG_CHE_BIEN).length,
      [ETrangThaiTrucTiep.SAN_SANG]:      active.filter((o) => o.trangThai === ETrangThaiTrucTiep.SAN_SANG).length,
      [ETrangThaiTrucTiep.HOAN_THANH]:    active.filter((o) => o.trangThai === ETrangThaiTrucTiep.HOAN_THANH).length,
      da_huy:                              cancelledIds.size,
    };
  }, [orders, cancelledIds]);

  // ── Filtered list ───────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
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
  }, [orders, activeTab, searchKw, cancelledIds]);

  // ── Handlers ────────────────────────────────────────────────────
  const handleMoveStatus = (
    maDon: string,
    newStatus: ETrangThaiTrucTiep | 'da_huy',
    silent = false,
  ) => {
    if (newStatus === 'da_huy') {
      setCancelledIds((prev) => new Set([...prev, maDon]));
      setOrders((prev) =>
        prev.map((o) => (o.maDon === maDon ? { ...o, trangThai: newStatus as any } : o)),
      );
      setSelectedOrder((prev) => (prev?.maDon === maDon ? null : prev));
      if (!silent) message.success(`Đã huỷ đơn ${maDon}`);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.maDon === maDon ? { ...o, trangThai: newStatus as any } : o)),
      );
      setSelectedOrder((prev) =>
        prev?.maDon === maDon ? { ...prev, trangThai: newStatus as any } : prev,
      );
      if (!silent) message.success(`Đã cập nhật đơn ${maDon}`);
    }
  };

  const handleCancelOrder = (maDon: string) => {
    Modal.confirm({
      title: 'Huỷ đơn hàng?',
      content: `Xác nhận huỷ đơn ${maDon}? Hành động không thể hoàn tác.`,
      okType: 'danger',
      okText: 'Huỷ đơn',
      cancelText: 'Không',
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

    if (newStatus === 'da_huy') {
      setCancelledIds((prev) => new Set([...prev, ...selectedRows]));
      setOrders((prev) =>
        prev.map((o) =>
          selectedRows.includes(o.maDon)
            ? { ...o, trangThai: newStatus as any }
            : o,
        ),
      );
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          selectedRows.includes(o.maDon)
            ? { ...o, trangThai: newStatus as ETrangThaiTrucTiep }
            : o,
        ),
      );
    }

    const label = action === 'cancel' ? 'huỷ' : 'cập nhật';
    message.success(`Đã ${label} ${selectedRows.length} đơn`);
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
        ${order.monAn
          .map((m) => `<div class="row"><span>${m.ten}</span><span>×${m.soLuong}</span></div>`)
          .join('')}
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

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Topbar title="Quản lý đơn hàng" />

        <div className={styles.pageBody}>

          {/* ── Tabs ── */}
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

          {/* ── Toolbar ── */}
          <div className={styles.toolbar}>
            <Input
              prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Tìm theo mã đơn, tên khách..."
              className={styles.searchInput}
              value={searchKw}
              onChange={(e) => setSearchKw(e.target.value)}
              allowClear
            />

            <div className={styles.toolbarRight}>
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.toggleBtn} ${view === 'table' ? styles.toggleActive : ''}`}
                  onClick={() => setView('table')}
                  title="Dạng bảng"
                >
                  <UnorderedListOutlined />
                </button>
                <button
                  className={`${styles.toggleBtn} ${view === 'kanban' ? styles.toggleActive : ''}`}
                  onClick={() => setView('kanban')}
                  title="Dạng kanban"
                >
                  <AppstoreOutlined />
                </button>
              </div>
            </div>
          </div>

          {/* ── Bulk action bar ── */}
          {selectedRows.length > 0 && (
            <div className={styles.bulkBar}>
              <span className={styles.bulkCount}>
                Đã chọn <strong>{selectedRows.length}</strong> đơn
              </span>
              <div className={styles.bulkActions}>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => handleBulkAction('confirm')}
                >
                  Xác nhận tất cả
                </Button>
                <Button size="small" onClick={() => handleBulkAction('done')}>
                  Hoàn tất
                </Button>
                <Button size="small" danger onClick={() => handleBulkAction('cancel')}>
                  Huỷ
                </Button>
                <button
                  className={styles.bulkClear}
                  onClick={() => setSelectedRows([])}
                  title="Bỏ chọn"
                >
                  <CloseOutlined />
                </button>
              </div>
            </div>
          )}

          {/* ── Content ── */}
          {view === 'table' ? (
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
      </div>

      {/* ── Drawer ── */}
      <OrderDrawer
        order={selectedOrder}
        cancelledIds={cancelledIds}
        onClose={() => setSelectedOrder(null)}
        onMoveStatus={handleMoveStatus}
        onCancel={handleCancelOrder}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default DonHang;
