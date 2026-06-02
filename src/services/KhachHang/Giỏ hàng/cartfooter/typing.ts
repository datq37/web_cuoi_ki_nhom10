import type { Voucher } from '../cartoption/typing';

export interface CartFooterProps {
    selectedVoucher?: Voucher;
    onConfirm: () => void;
    isLoading?: boolean;
}
