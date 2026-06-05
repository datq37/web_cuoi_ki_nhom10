import { useCallback, useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { hasLoginToken } from '@/utils/auth';

// Dựa vào IVatDung trong index.tsx
// type EDanhMucVD    = 'ban_ghe' | 'bat_dua' | 'noi_nieu' | 'khac';
// type ETinhTrangVD  = 'tot' | 'can_sua' | 'hong';

export default function useCoSoVatChatModel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!hasLoginToken()) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${ip3}/facilities/equipments`);
      if (res.data && res.data.items) {
        setItems(res.data.items.map((apiItem: any) => ({
          id: apiItem.id,
          ten: apiItem.ten,
          danhMuc: apiItem.danhmuc || 'khac',
          soLuong: parseInt(apiItem.soluong) || 0,
          tinhTrang: apiItem.chatluong || 'tot',
          ghiChu: apiItem.ghichu || ''
        })));
      }
    } catch (error) {
      console.error("Failed to load equipments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addVatDung = async (data: any) => {
    try {
      const res = await axios.post(`${ip3}/facilities/equipments`, {
        id: data.id,
        ten: data.ten,
        soluong: String(data.soLuong),
        chatluong: data.tinhTrang,
        danhmuc: data.danhMuc,
        ghichu: data.ghiChu
      });
      await fetchItems();
      return res.data;
    } catch (error) {
      console.error("Failed to add equipment", error);
      throw error;
    }
  };

  const updateVatDung = async (id: string, data: any) => {
    try {
      const res = await axios.patch(`${ip3}/facilities/equipments/${id}`, {
        ten: data.ten,
        soluong: String(data.soLuong),
        chatluong: data.tinhTrang,
        danhmuc: data.danhMuc,
        ghichu: data.ghiChu
      });
      await fetchItems();
      return res.data;
    } catch (error) {
      console.error("Failed to update equipment", error);
      throw error;
    }
  };

  const deleteVatDung = async (id: string) => {
    try {
      await axios.delete(`${ip3}/facilities/equipments/${id}`);
      await fetchItems();
    } catch (error) {
      console.error("Failed to delete equipment", error);
      throw error;
    }
  };

  return {
    items,
    loading,
    addVatDung,
    updateVatDung,
    deleteVatDung,
    refresh: fetchItems,
  };
}
