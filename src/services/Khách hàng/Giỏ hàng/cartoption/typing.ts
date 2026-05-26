export interface Voucher {
    id: string;
    code: string;
    discount: number; // số tiền giảm (so_tien/mien_ship) hoặc % giảm (phan_tram)
    loai?: 'phan_tram' | 'so_tien' | 'mien_ship'; // loại giảm để tính đúng
    desc: string;
    minOrder?: number;
    badge?: string;
    expire?: string;
    valueLabel?: string;
    typeLabel?: string;
    theme?: 'green' | 'orange' | 'lime';
}

export interface CartOptionProps {
    note: string;
    onChangeNote: (note: string) => void;
    selectedVoucher?: Voucher;
    onSelectVoucher: (voucher: Voucher | undefined) => void;
    subtotal: number;
}
