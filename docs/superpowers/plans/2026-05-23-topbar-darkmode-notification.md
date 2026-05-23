# Topbar: Dark Mode + Notification Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xoá search bar khỏi Topbar, thêm notification dropdown popup và dark/light mode toggle đồng bộ toàn bộ admin pages.

**Architecture:** Hook `useTheme` đọc/ghi `localStorage` và gắn attribute `data-theme="dark"` lên `document.body`. Mọi Less file thêm overrides dạng `:global([data-theme="dark"]) .className { ... }`. Topbar sở hữu state toggle + Popover thông báo.

**Tech Stack:** React 17, TypeScript, Less CSS Modules, Ant Design 4.21 (`Popover`, `Badge`, `Button`), UMI 3.

---

## Color mapping light → dark

| Light | Dark | Dùng cho |
|---|---|---|
| `#f8fafc` / `#f9fafb` | `#0f172a` | Page background, input bg |
| `#ffffff` | `#1e293b` | Card, panel, sidebar, topbar |
| `#f0f0f0` / `#f1f5f9` / `#e5e7eb` | `#334155` | Border |
| `#111827` | `#f1f5f9` | Text đậm |
| `#374151` | `#cbd5e1` | Text giữa |
| `#6b7280` | `#94a3b8` | Text muted |
| `#9ca3af` | `#64748b` | Text nhạt |

---

## Task 1: Hook `useTheme`

**Files:**
- Create: `src/hooks/useTheme.ts`

- [ ] **Tạo file hook**

```ts
// src/hooks/useTheme.ts
import { useEffect, useState } from 'react';

const KEY = 'ct-admin-theme';

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(KEY) === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
    localStorage.setItem(KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDark = () => setIsDark((p) => !p);

  return { isDark, toggleDark };
}
```

- [ ] **Commit**

```bash
git add src/hooks/useTheme.ts
git commit -m "feat: add useTheme hook with localStorage persistence"
```

---

## Task 2: Cập nhật Topbar TSX

**Files:**
- Modify: `src/pages/Quản Trị/Topbar/index.tsx`

**Thay đổi:**
- Xoá: `Input` search, `SlidersOutlined` button, import liên quan
- Thêm: `MoonOutlined`/`SunOutlined` toggle, `Popover` notification dropdown

- [ ] **Thay toàn bộ nội dung file**

```tsx
// src/pages/Quản Trị/Topbar/index.tsx
import {
  BellOutlined,
  CalendarOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Popover } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import styles from './index.less';

moment.locale('vi');

interface INotif {
  id: string;
  icon: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const NOTIF_LIST: INotif[] = [
  { id: '1', icon: '🛒', title: 'Đơn hàng mới #DH042', desc: 'Nguyễn Văn Hùng đặt 3 món', time: '2 phút trước', read: false },
  { id: '2', icon: '⚠️', title: 'Kho sắp hết — Thịt bò', desc: 'Còn lại 1.2kg, dưới mức tối thiểu', time: '15 phút trước', read: false },
  { id: '3', icon: '✅', title: 'Đơn #DH038 đã hoàn thành', desc: 'Lê Thị Hà đã nhận', time: '1 giờ trước', read: true },
];

const NotifPopupContent: React.FC<{ onMarkAll: () => void; list: INotif[] }> = ({ onMarkAll, list }) => (
  <div className={styles.notifPopup}>
    <div className={styles.notifHeader}>
      <span className={styles.notifTitle}>Thông báo</span>
      <button className={styles.markAllBtn} onClick={onMarkAll}>
        Đánh dấu tất cả đã đọc
      </button>
    </div>
    <div className={styles.notifList}>
      {list.map((n) => (
        <div key={n.id} className={`${styles.notifItem} ${!n.read ? styles.notifUnread : ''}`}>
          <span className={styles.notifIcon}>{n.icon}</span>
          <div className={styles.notifBody}>
            <div className={styles.notifItemTitle}>{n.title}</div>
            <div className={styles.notifDesc}>{n.desc} · {n.time}</div>
          </div>
          {!n.read && <span className={styles.notifDot} />}
        </div>
      ))}
    </div>
    <div className={styles.notifFooter}>Xem tất cả thông báo →</div>
  </div>
);

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

const Topbar: React.FC<TopbarProps> = ({ title = 'Tổng quan', subtitle }) => {
  const dateStr = moment().format('D [tháng] M, YYYY');
  const { isDark, toggleDark } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifList, setNotifList] = useState<INotif[]>(NOTIF_LIST);

  const unreadCount = notifList.filter((n) => !n.read).length;

  const handleMarkAll = () => setNotifList((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle ? (
          <div className={styles.pageDate}>{subtitle}</div>
        ) : (
          <div className={styles.pageDate}>
            <CalendarOutlined className={styles.calIcon} />
            <span>Hôm nay, {dateStr}</span>
          </div>
        )}
      </div>

      <div className={styles.right}>
        {/* Dark mode toggle */}
        <Button
          className={styles.iconBtn}
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleDark}
          title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
        />

        {/* Notification bell */}
        <Popover
          open={notifOpen}
          onOpenChange={setNotifOpen}
          trigger="click"
          placement="bottomRight"
          arrow={false}
          overlayInnerStyle={{ padding: 0, borderRadius: 12 }}
          content={<NotifPopupContent onMarkAll={handleMarkAll} list={notifList} />}
        >
          <Badge count={unreadCount} offset={[-2, 2]}>
            <Button className={styles.iconBtn} icon={<BellOutlined />} />
          </Badge>
        </Popover>

        {/* User avatar */}
        <div className={styles.userWrap}>
          <Avatar className={styles.userAvatar} size={36}>MT</Avatar>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
```

- [ ] **Commit**

```bash
git add "src/pages/Quản Trị/Topbar/index.tsx"
git commit -m "feat: remove search bar, add dark toggle + notification popover to Topbar"
```

---

## Task 3: Cập nhật Topbar Less

**Files:**
- Modify: `src/pages/Quản Trị/Topbar/index.less`

- [ ] **Thay toàn bộ nội dung file**

```less
@primary: #16a34a;
@border: #f0f0f0;
@text-dark: #111827;
@text-mid: #374151;
@text-muted: #6b7280;
@text-light: #9ca3af;

.topbar {
  height: 68px;
  background: #ffffff;
  border-bottom: 1px solid @border;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 99;
  flex-shrink: 0;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pageTitle {
  font-size: 22px;
  font-weight: 700;
  color: @text-dark;
  margin: 0;
  line-height: 1.25;
}

.pageDate {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: @text-muted;
}

.calIcon { font-size: 12px; }

.right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.iconBtn {
  width: 38px !important;
  height: 38px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 9px !important;
  background: white !important;
  color: @text-mid !important;
  padding: 0 !important;
  box-shadow: none !important;
  font-size: 15px !important;
  transition: border-color 0.15s, background 0.15s !important;

  &:hover {
    border-color: #d1d5db !important;
    background: #f9fafb !important;
    color: @text-dark !important;
  }
}

:global(.ant-badge) { line-height: 1; }

:global(.ant-badge .ant-badge-count) {
  background: #ef4444;
  box-shadow: none;
  font-size: 10px;
  min-width: 17px;
  height: 17px;
  line-height: 17px;
  padding: 0 4px;
}

.userWrap {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 9px;
  transition: background 0.12s;
  &:hover { background: #f9fafb; }
}

.userAvatar {
  background: @primary !important;
  font-weight: 700 !important;
  font-size: 12px !important;
  flex-shrink: 0;
}

// ── Notification Popup ──────────────────────────────────────────
.notifPopup {
  width: 340px;
  border-radius: 12px;
  overflow: hidden;
}

.notifHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.notifTitle {
  font-size: 14px;
  font-weight: 700;
  color: @text-dark;
}

.markAllBtn {
  background: none;
  border: none;
  padding: 0;
  font-size: 12px;
  color: @primary;
  cursor: pointer;
  font-weight: 500;
  &:hover { color: #15803d; }
}

.notifList { padding: 0; }

.notifItem {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid #f8fafc;
  cursor: pointer;
  transition: background 0.12s;
  &:last-child { border-bottom: none; }
  &:hover { background: #f9fafb; }
}

.notifUnread { background: #f0fdf4; &:hover { background: #dcfce7; } }

.notifIcon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }

.notifBody { flex: 1; min-width: 0; }

.notifItemTitle {
  font-size: 13px;
  font-weight: 600;
  color: @text-dark;
  margin-bottom: 3px;
}

.notifDesc {
  font-size: 11.5px;
  color: @text-muted;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notifDot {
  width: 7px;
  height: 7px;
  background: @primary;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.notifFooter {
  padding: 10px 16px;
  text-align: center;
  font-size: 12.5px;
  color: @text-muted;
  border-top: 1px solid #f1f5f9;
  cursor: pointer;
  &:hover { color: @primary; }
}

// ── Dark mode overrides ─────────────────────────────────────────
:global([data-theme="dark"]) {
  .topbar {
    background: #1e293b;
    border-bottom-color: #334155;
  }

  .pageTitle { color: #f1f5f9; }
  .pageDate { color: #94a3b8; }

  .iconBtn {
    background: #0f172a !important;
    border-color: #334155 !important;
    color: #cbd5e1 !important;
    &:hover {
      background: #1e293b !important;
      border-color: #475569 !important;
      color: #f1f5f9 !important;
    }
  }

  .userWrap { &:hover { background: #0f172a; } }

  .notifHeader { border-bottom-color: #334155; }
  .notifTitle { color: #f1f5f9; }
  .notifItem {
    border-bottom-color: #1e293b;
    &:hover { background: #1e293b; }
  }
  .notifUnread { background: rgba(22,163,74,.12); &:hover { background: rgba(22,163,74,.18); } }
  .notifItemTitle { color: #f1f5f9; }
  .notifDesc { color: #94a3b8; }
  .notifFooter { border-top-color: #334155; color: #94a3b8; &:hover { color: #4ade80; } }
  .notifPopup { background: #1e293b; }
}
```

- [ ] **Commit**

```bash
git add "src/pages/Quản Trị/Topbar/index.less"
git commit -m "style: update Topbar Less — remove search styles, add notification popup + dark mode"
```

---

## Task 4: Sidebar Less — Dark overrides

**Files:**
- Modify: `src/pages/Quản Trị/Sidebar/index.less`

- [ ] **Thêm block dark overrides vào cuối file** (sau `.collapseBtn`)

```less
// ── Dark mode overrides ─────────────────────────────────────────
:global([data-theme="dark"]) {
  .sidebar {
    background: #1e293b;
    border-right-color: #334155;
  }

  .reloadBtn { color: #64748b; &:hover { background: #0f172a; color: #94a3b8; } }

  .brandName { color: #f1f5f9; }
  .brandSub  { color: #64748b; }

  .searchBox {
    background: #0f172a;
    border-color: #334155;
    &:hover { border-color: #475569; }
  }
  .searchIcon, .searchPlaceholder { color: #64748b; }
  .searchShortcut { background: #334155; border-color: #475569; color: #64748b; }

  .groupLabel { color: #64748b; }

  .menuItem {
    color: #94a3b8;
    &:hover { background: #0f172a; color: #cbd5e1; .menuIcon { color: #94a3b8; } }
    &.active { background: rgba(22,163,74,.15); color: #4ade80; .menuIcon { color: #4ade80; } }
  }
  .menuIcon { color: #64748b; }

  .userSection { border-top-color: #334155; }
  .userCard { &:hover { background: #0f172a; } }
  .userName { color: #f1f5f9; }
  .userRole  { color: #64748b; }
  .logoutBtn { color: #64748b; &:hover { background: rgba(239,68,68,.15); color: #ef4444; } }

  .collapseBtn { color: #64748b; &:hover { background: #0f172a; color: #94a3b8; } }
}
```

- [ ] **Commit**

```bash
git add "src/pages/Quản Trị/Sidebar/index.less"
git commit -m "style: add dark mode overrides to Sidebar"
```

---

## Task 5: Đơn Hàng Less — Dark overrides

**Files:**
- Modify: `src/pages/Quản Trị/Đơn Hàng/index.less`

- [ ] **Thêm block vào cuối file**

```less
// ── Dark mode overrides ─────────────────────────────────────────
:global([data-theme="dark"]) {
  .adminLayout { background: #0f172a; }
}
```

- [ ] **Commit**

```bash
git add "src/pages/Quản Trị/Đơn Hàng/index.less"
git commit -m "style: add dark mode overrides to Đơn Hàng"
```

---

## Task 6: Tổng Quan Less — Dark overrides

**Files:**
- Modify: `src/pages/Quản Trị/Tổng Quan/index.less`

- [ ] **Thêm block vào cuối file**

```less
// ── Dark mode overrides ─────────────────────────────────────────
:global([data-theme="dark"]) {
  .adminLayout { background: #0f172a; }

  .tabsRow { background: #1e293b; border-color: #334155; }
  .tabBtn { color: #94a3b8; &:hover { background: #0f172a; color: #f1f5f9; } }

  .dateChip { background: #1e293b; border-color: #334155; color: #94a3b8; }

  // Kanban
  .liveBar, .summaryBar { background: #1e293b; border-color: #334155; }
  .liveTxt { color: #f1f5f9; }
  .liveDesc { color: #94a3b8; }
  .liveStat { color: #cbd5e1; strong { color: #f1f5f9; } }
  .liveStatDiv { background: #334155; }
  .kanbanCot { background: #1e293b; border-color: #334155; }
  .cotHeader { border-bottom-color: #334155; }
  .cotTitle { color: #f1f5f9; }
  .cotFooter { border-top-color: #334155; color: #94a3b8; }
  .donCard { background: #0f172a; border-color: #334155; }
  .maDon { color: #f1f5f9; }
  .tenKH { color: #f1f5f9; }
  .thoiGianDon { color: #64748b; }
  .monRow { color: #cbd5e1; }
  .slMon, .conLai { color: #64748b; }
  .donCardFooter { border-top-color: #334155; }
  .tongTienDon { color: #f1f5f9; }
  .summaryTitle { color: #f1f5f9; }
  .summaryDiv { background: #334155; }
  .summaryStat { strong { color: #f1f5f9; } span { color: #94a3b8; } }

  // Phân tích
  .barChartCard, .donutCard, .bottomCard, .hoatDongCard { background: #1e293b; border-color: #334155; }
  .chartTitle2 { color: #f1f5f9; }
  .chartLegend { color: #94a3b8; }
  .donutSubtitle { color: #94a3b8; }
  .donutLegLabel { color: #cbd5e1; }
  .donutLegPct { color: #f1f5f9; }
  .cardTitle { color: #f1f5f9; }
  .topMonTable {
    th { color: #64748b; border-bottom-color: #334155; }
    td { color: #cbd5e1; border-bottom-color: #1e293b; }
  }
  .tdRight { color: #f1f5f9; }
  .trangThaiTen { color: #cbd5e1; }
  .trangThaiSo { color: #94a3b8; }
  .progressWrap2 { background: #334155; }
  .trangThaiPct { color: #f1f5f9; }
  .hieuSuatLabel { color: #94a3b8; }
  .hieuSuatValue { color: #f1f5f9; }
  .hieuSuatUnit { color: #94a3b8; }
  .periodSelect { background: #0f172a; border-color: #334155; color: #94a3b8; &:hover { background: #334155; } }
  .hoatDongItem { background: #0f172a; border-color: #334155; &:hover { background: #1e293b; border-color: #475569; } }
  .hdTitle { color: #f1f5f9; }
  .hdMota { color: #94a3b8; }
  .hdTime, .hdArrow { color: #64748b; }

  // Tác nghiệp
  .tnStatCard, .tnInfoCard, .tnChartCard, .tnTableCard, .tnTopCard { background: #1e293b; border-color: #334155; }
  .tnStatLabel { color: #94a3b8; }
  .tnStatValue { color: #f1f5f9; }
  .tnChartTitle { color: #f1f5f9; }
  .tnChartSub { color: #94a3b8; }
  .tnTableTitle { color: #f1f5f9; }
  .tnTable {
    th { color: #64748b; border-bottom-color: #334155; }
    td { color: #cbd5e1; border-bottom-color: #1e293b; }
  }
  .tnMaDon, .tnKH, .tnTien { color: #f1f5f9; }
  .tnPhong, .tnMon, .tnGio { color: #94a3b8; }
  .tnTopName { color: #f1f5f9; }
  .tnLegLabel { color: #cbd5e1; }
  .tnLegVal { color: #f1f5f9; }
  .tnTopRow { border-bottom-color: #334155; }
  .tnInfoTitle { color: #94a3b8; }
  .tnDishName { color: #f1f5f9; }
  .tnDishSold { color: #94a3b8; }
  .tnPromoName { color: #f1f5f9; }
  .tnPromoLeft { color: #94a3b8; }
  .tnSatisfyScore { color: #f1f5f9; }
  .tnSatisfyDesc { color: #94a3b8; }
}
```

- [ ] **Commit**

```bash
git add "src/pages/Quản Trị/Tổng Quan/index.less"
git commit -m "style: add dark mode overrides to Tổng Quan"
```

---

## Task 7: Quản Lý Món Less — Dark overrides

**Files:**
- Modify: `src/pages/Quản Trị/Quản Lý Món/index.less`

- [ ] **Thêm block vào cuối file**

```less
// ── Dark mode overrides ─────────────────────────────────────────
:global([data-theme="dark"]) {
  .adminLayout { background: #0f172a; }

  .tabsRow { background: #1e293b; border-color: #334155; }
  .tabBtn { color: #94a3b8; &:hover { background: #0f172a; color: #f1f5f9; } }

  .viewToggle { border-color: #334155; }
  .toggleBtn { background: #1e293b; color: #94a3b8; &:hover { background: #0f172a; color: #f1f5f9; } }

  .monCard {
    background: #1e293b;
    border-color: #334155;
    &:hover { box-shadow: 0 6px 24px rgba(0,0,0,.35); }
  }
  .cardName { color: #f1f5f9; }
  .cardMoTa { color: #64748b; }
  .statItem { color: #64748b; }
  .cardFooter { border-top-color: #334155; }
  .actionBtn {
    background: #0f172a;
    border-color: #334155;
    color: #94a3b8;
    &:hover { background: rgba(22,163,74,.12); border-color: #16a34a; color: #4ade80; }
  }
  .actionDelete {
    &:hover { background: rgba(239,68,68,.12) !important; border-color: #ef4444 !important; color: #ef4444 !important; }
  }
}
```

- [ ] **Commit**

```bash
git add "src/pages/Quản Trị/Quản Lý Món/index.less"
git commit -m "style: add dark mode overrides to Quản Lý Món"
```

---

## Task 8: Kho Nguyên Liệu Less — Dark overrides

**Files:**
- Modify: `src/pages/Quản Trị/Kho Nguyên Liệu/index.less`

- [ ] **Thêm block vào cuối file**

```less
// ── Dark mode overrides ─────────────────────────────────────────
:global([data-theme="dark"]) {
  .adminLayout { background: #0f172a; }

  .statCard { background: #1e293b; border-color: #334155; }
  .statValue { color: #f1f5f9; }
  .statLabel { color: #64748b; }
  .statSub   { color: #94a3b8; }

  .warnBanner { background: rgba(251,191,36,.08); border-color: rgba(251,191,36,.25); }
  .warnLeft   { color: #fcd34d; strong { color: #fde68a; } }

  .tableSection { background: #1e293b; border-color: #334155; }
  .tableToolbar { border-bottom-color: #334155; }

  .table {
    :global(.ant-table-thead > tr > th) {
      background: #0f172a !important;
      color: #64748b !important;
      border-bottom-color: #334155 !important;
    }
    :global(.ant-table-tbody > tr > td) {
      border-bottom-color: #334155 !important;
      background: #1e293b;
    }
    :global(.ant-table-tbody > tr:hover > td) {
      background: #0f172a !important;
    }
  }

  .nlIcon { background: #334155; }
  .nlIconSvg { color: #94a3b8; }
  .nlTen { color: #f1f5f9; }
  .nlDonVi { color: #64748b; }
  .nhaCungCap { color: #cbd5e1; }
  .tonKhoValue { color: #f1f5f9; }
  .progressBar { background: #334155; }
  .mucToiThieu { color: #64748b; }
  .giaNhap { color: #cbd5e1; }

  .btnNhap {
    background: #0f172a;
    border-color: #334155;
    color: #cbd5e1;
    &:hover { background: rgba(22,163,74,.12); border-color: #16a34a; color: #4ade80; }
  }
  .btnMore {
    background: #0f172a;
    border-color: #334155;
    color: #94a3b8;
    &:hover { background: #334155; color: #f1f5f9; }
  }
}
```

- [ ] **Commit**

```bash
git add "src/pages/Quản Trị/Kho Nguyên Liệu/index.less"
git commit -m "style: add dark mode overrides to Kho Nguyên Liệu"
```

---

## Task 9: Khuyến Mãi Less — Dark overrides

**Files:**
- Modify: `src/pages/Quản Trị/Khuyến Mãi/index.less`

- [ ] **Thêm block vào cuối file**

```less
// ── Dark mode overrides ─────────────────────────────────────────
:global([data-theme="dark"]) {
  .adminLayout { background: #0f172a; }

  .statCard { background: #1e293b; border-color: #334155; }
  .statValue { color: #f1f5f9; }
  .statLabel { color: #64748b; }
  .statSub   { color: #94a3b8; }

  .promoList { background: #1e293b; border-color: #334155; }
  .divider   { background: #334155; }
  .promoRow  { &:hover { background: #0f172a; } }

  .promoName { color: #f1f5f9; }
  .promoMoTa { color: #64748b; }
  .usageLabel { color: #64748b; }
  .usageCount { color: #cbd5e1; }
  .usageBar   { background: #334155; }
  .expiryLabel { color: #64748b; }
  .expiryDate  { color: #cbd5e1; }

  .moreBtn {
    background: #0f172a;
    border-color: #334155;
    color: #94a3b8;
    &:hover { background: #334155; color: #f1f5f9; }
  }
}
```

- [ ] **Commit**

```bash
git add "src/pages/Quản Trị/Khuyến Mãi/index.less"
git commit -m "style: add dark mode overrides to Khuyến Mãi"
```

---

## Task 10: Khách Hàng Less — Dark overrides

**Files:**
- Modify: `src/pages/Quản Trị/Khách Hàng/index.less`

- [ ] **Thêm block vào cuối file**

```less
// ── Dark mode overrides ─────────────────────────────────────────
:global([data-theme="dark"]) {
  .adminLayout { background: #0f172a; }

  .statCard { background: #1e293b; border-color: #334155; }
  .statValue { color: #f1f5f9; }
  .statLabel { color: #64748b; }
  .statSub   { color: #94a3b8; }

  .tableSection { background: #1e293b; border-color: #334155; }
  .tableToolbar { border-bottom-color: #334155; }

  .table {
    :global(.ant-table-thead > tr > th) {
      background: #0f172a !important;
      color: #64748b !important;
      border-bottom-color: #334155 !important;
    }
    :global(.ant-table-tbody > tr > td) {
      border-bottom-color: #334155 !important;
      background: #1e293b;
    }
    :global(.ant-table-tbody > tr:hover > td) {
      background: #0f172a !important;
    }
  }

  .khachTen  { color: #f1f5f9; }
  .khachEmail { color: #64748b; }
  .phongBan  { color: #cbd5e1; }
  .soDon     { color: #f1f5f9; }
  .chiTieu   { color: #cbd5e1; }
  .thamGia   { color: #64748b; }

  .moreBtn {
    background: #0f172a;
    border-color: #334155;
    color: #94a3b8;
    &:hover { background: #334155; color: #f1f5f9; }
  }
}
```

- [ ] **Commit**

```bash
git add "src/pages/Quản Trị/Khách Hàng/index.less"
git commit -m "style: add dark mode overrides to Khách Hàng"
```

---

## Task 11: Nhân Viên Căng Tin Less — Dark overrides

**Files:**
- Modify: `src/pages/Quản Trị/Nhân Viên Căng Tin/index.less`

- [ ] **Thêm block vào cuối file**

```less
// ── Dark mode overrides ─────────────────────────────────────────
:global([data-theme="dark"]) {
  .adminLayout { background: #0f172a; }

  .card {
    background: #1e293b;
    border-color: #334155;
    &:hover { box-shadow: 0 6px 20px rgba(0,0,0,.35); }
  }
  .cardName  { color: #f1f5f9; }
  .cardEmail { color: #64748b; }
  .lastActive { color: #64748b; }

  .actionBtn {
    background: #0f172a;
    border-color: #334155;
    color: #cbd5e1;
    &:hover { background: rgba(22,163,74,.12); border-color: #16a34a; color: #4ade80; }
  }

  .addCard {
    border-color: #334155;
    &:hover { border-color: #16a34a; background: rgba(22,163,74,.08); .addTitle { color: #4ade80; } }
  }
  .addTitle { color: #cbd5e1; }
  .addSub   { color: #64748b; }
}
```

- [ ] **Commit**

```bash
git add "src/pages/Quản Trị/Nhân Viên Căng Tin/index.less"
git commit -m "style: add dark mode overrides to Nhân Viên Căng Tin"
```

---

## Task 12: Cài Đặt Less — Dark overrides

**Files:**
- Modify: `src/pages/Quản Trị/Cài Đặt/index.less`

- [ ] **Thêm block vào cuối file**

```less
// ── Dark mode overrides ─────────────────────────────────────────
:global([data-theme="dark"]) {
  .adminLayout { background: #0f172a; }

  .leftNav { background: #1e293b; border-color: #334155; }
  .navItem { color: #94a3b8; &:hover { background: #0f172a; color: #f1f5f9; } }
  .navActive { background: rgba(22,163,74,.15) !important; color: #4ade80 !important; .navIcon { color: #4ade80 !important; } }
  .navIcon { color: #64748b; }

  .rightContent { background: #1e293b; border-color: #334155; }
  .contentTitle { color: #f1f5f9; }
  .contentSub   { color: #64748b; }

  .logoSection { background: #0f172a; }
  .logoName { color: #f1f5f9; }
  .logoHint { color: #64748b; }

  .fieldLabel { color: #cbd5e1; }
  .fieldInput {
    background: #0f172a !important;
    border-color: #334155 !important;
    color: #f1f5f9 !important;
    :global(.ant-input), :global(.ant-input-password) { background: #0f172a; color: #f1f5f9; }
    &:focus-within { border-color: #16a34a !important; }
  }

  .dayList { border-color: #334155; }
  .dayRow { border-bottom-color: #334155; &:hover { background: #0f172a; } }
  .dayLabel { color: #cbd5e1; }
  .timeInput { background: #0f172a !important; border-color: #334155 !important; color: #f1f5f9 !important; }
  .timeDash { color: #64748b; }

  .payList { border-color: #334155; }
  .payRow { border-bottom-color: #334155; &:hover { background: #0f172a; } }
  .payIconWrap { background: #334155; }
  .payName { color: #f1f5f9; }
  .payMoTa { color: #64748b; }

  .notifList { border-color: #334155; }
  .notifRow { &:hover { background: #0f172a; } }
  .notifBorder { border-bottom-color: #334155; }
  .notifName { color: #f1f5f9; }
  .notifMoTa { color: #64748b; }

  .securityList { border-color: #334155; }
  .secRow { border-bottom-color: #334155; &:hover { background: #0f172a; } }
  .secName { color: #f1f5f9; }
  .secMoTa { color: #64748b; }
}
```

- [ ] **Commit**

```bash
git add "src/pages/Quản Trị/Cài Đặt/index.less"
git commit -m "style: add dark mode overrides to Cài Đặt"
```

---

## Checklist cuối

- [ ] Chạy `npm run dev` (hoặc `yarn dev`) và kiểm tra từng trang
- [ ] Bấm toggle 🌙 trên Topbar — toàn bộ Sidebar + content phải đổi sang navy dark
- [ ] Bấm toggle ☀️ — quay về sáng
- [ ] Tải lại trang — theme được ghi nhớ (localStorage `ct-admin-theme`)
- [ ] Bấm chuông 🔔 — popup 3 thông báo xuất hiện, 2 unread highlight xanh, badge hiển thị `2`
- [ ] Bấm "Đánh dấu tất cả đã đọc" — badge về `0`, background unread mất
- [ ] Bấm ngoài popup — popup tự đóng
