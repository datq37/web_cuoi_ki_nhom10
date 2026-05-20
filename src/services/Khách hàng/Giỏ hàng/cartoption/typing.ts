export interface Voucher {
    id: string;
    code: string;
    discount: number; // số tiền giảm hoặc % (tùy logic xử lý sau này)
    desc: string;
    minOrder?: number;
}

export interface CartOptionProps {
    note: string;
    onChangeNote: (note: string) => void;
    selectedVoucher?: Voucher;
    onSelectVoucher: (voucher: Voucher | undefined) => void;
    subtotal: number;
}
