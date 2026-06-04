import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { SyncAdapters } from '@/services/api/adapters';
import { IKhuyenMai, IStatKhuyenMai } from '@/services/QuanTri/Khuyến Mãi/typing';

const formatDateForApi = (value?: string) => {
  if (!value) return undefined;
  const parts = value.split('/');
  if (parts.length !== 3) return value;

  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export default function useKhuyenMaiModel() {
  const [items, setItems] = useState<IKhuyenMai[]>([]);

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get(`${ip3}/promotions`);
      if (res.data && res.data.items) {
        setItems(res.data.items.map(SyncAdapters.mapAdminPromoToUI));
      }
    } catch (error) {
      console.error("Failed to load promotions:", error);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addKhuyenMai = async (data: any) => {
    try {
      const res = await axios.post(`${ip3}/promotions`, {
        ma: data.ma,
        ten: data.ten,
        mota: data.moTa,
        loai: data.loai,
        giatrigiam: data.giaTriGiam,
        dontooithieu: data.donToiThieu,
        gioihan: data.gioiHan,
        hansudung: formatDateForApi(data.hetHan),
        trangthai: data.trangThai,
        hoatdong: data.hoatDong,
      });
      await fetchItems();
      return res.data;
    } catch (error) {
      console.error("Failed to add promotion", error);
      throw error;
    }
  };

  const updateKhuyenMai = async (id: string, data: any) => {
    try {
      const res = await axios.patch(`${ip3}/promotions/${id}`, {
        ma: data.ma,
        ten: data.ten,
        mota: data.moTa,
        loai: data.loai,
        giatrigiam: data.giaTriGiam,
        dontooithieu: data.donToiThieu,
        gioihan: data.gioiHan,
        hansudung: formatDateForApi(data.hetHan),
        trangthai: data.trangThai,
        hoatdong: data.hoatDong,
      });
      await fetchItems();
      return res.data;
    } catch (error) {
      console.error("Failed to update promotion", error);
      throw error;
    }
  };

  const deleteKhuyenMai = async (id: string) => {
    try {
      await axios.delete(`${ip3}/promotions/${id}`);
      await fetchItems();
    } catch (error) {
      console.error("Failed to delete promotion", error);
      throw error;
    }
  };

  const toggleHoatDong = async (id: string, hoatDong: boolean) => {
    try {
      await axios.patch(`${ip3}/promotions/${id}`, { hoatdong: hoatDong });
      await fetchItems();
    } catch (error) {
      console.error("Failed to toggle promotion", error);
      throw error;
    }
  };

  const stats: IStatKhuyenMai = useMemo(() => {
    const dangHoatDong = items.filter(i => i.hoatDong).length;
    const luotSuDung = items.reduce((sum, i) => sum + i.daDung, 0);
    // Mock doanh thu and ty le chuyen doi
    return {
      dangHoatDong,
      luotSuDung,
      doanhThuTao: '12.4tr',
      tyLeChuyenDoi: 62,
    };
  }, [items]);

  return {
    items,
    stats,
    addKhuyenMai,
    updateKhuyenMai,
    deleteKhuyenMai,
    toggleHoatDong,
    refresh: fetchItems,
  };
}
