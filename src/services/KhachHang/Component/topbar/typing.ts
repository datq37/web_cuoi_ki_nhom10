export enum ThemeType {
    LIGHT = 'light',
    DARK = 'dark'
}

export interface TopbarProps {
    crumbs: string[];
    cartCount?: number;
    onCartOpen?: () => void;
    onNotifOpen?: () => void;
    notifOpen?: boolean;
    notifs?: any[];
    theme?: ThemeType;
    onToggleTheme?: () => void;
    unreadCount?: number;
}
