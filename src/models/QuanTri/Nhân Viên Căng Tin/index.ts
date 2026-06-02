import { useCallback, useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { SyncAdapters } from '@/services/api/adapters';
import { INhanVien } from '@/services/QuanTri/Nhân Viên Căng Tin/typing';

export default function useNhanVienModel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${ip3}/employees`);
      if (res.data && res.data.items) {
        setItems(res.data.items.map(SyncAdapters.mapAdminNhanVienToUI));
      }
    } catch (error) {
      console.error("Failed to load employees:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addNhanVien = async (data: any) => {
    try {
      const res = await axios.post(`${ip3}/employees`, {
        manv: data.id,
        ten: data.hoTen,
        email: data.email,
        sodienthoai: data.soDienThoai,
        chucvu: data.vaiTro,
        ngaybatdau: data.ngayBatDau,
        luong: data.mucLuong,
        viettat: data.vietTat,
        maunen: data.mauNen,
        hoatdonggannhat: data.hoatDongGanNhat,
      });
      await fetchItems();
      return res.data;
    } catch (error) {
      console.error("Failed to add employee", error);
      throw error;
    }
  };

  const updateNhanVien = async (id: string, data: any) => {
    try {
      const res = await axios.patch(`${ip3}/employees/${id}`, {
        ten: data.hoTen,
        email: data.email,
        sodienthoai: data.soDienThoai,
        chucvu: data.vaiTro,
        ngaybatdau: data.ngayBatDau,
        luong: data.mucLuong,
        viettat: data.vietTat,
        maunen: data.mauNen,
        hoatdonggannhat: data.hoatDongGanNhat,
      });
      await fetchItems();
      return res.data;
    } catch (error) {
      console.error("Failed to update employee", error);
      throw error;
    }
  };

  const deleteNhanVien = async (id: string) => {
    try {
      await axios.delete(`${ip3}/employees/${id}`);
      await fetchItems();
    } catch (error) {
      console.error("Failed to delete employee", error);
      throw error;
    }
  };

  return {
    items,
    loading,
    addNhanVien,
    updateNhanVien,
    deleteNhanVien,
    refresh: fetchItems,
  };
}
