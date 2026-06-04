import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { SyncAdapters } from '@/services/api/adapters';
import { IMonAn } from '@/services/QuanTri/Quản Lý Món/typing';

export default function useQuanLyMonModel() {
  const [items, setItems] = useState<IMonAn[]>([]);
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${ip3}/categories`);
      if (res.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get(`${ip3}/menus/items?limit=200`);
      if (res.data && res.data.items) {
        setItems(res.data.items.map(SyncAdapters.mapAdminMenuToUI));
      }
    } catch (error) {
      console.error("Failed to load menu items:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, [fetchCategories, fetchItems]);

  const tabCounts = useMemo(() => {
    const counts: Record<string | number, number> = { tat_ca: items.length };
    categories.forEach(c => {
       counts[c.id] = items.filter(m => m.danhMuc === c.id).length;
    });
    return counts;
  }, [items, categories]);

  const addMon = useCallback(async (values: any) => {
    try {
      const payload = {
        mamon: values.id || `MON${Math.floor(Math.random() * 1000000)}`,
        ten: values.ten,
        gia: values.giaBan,
        mieuta: values.moTa,
        danhmucid: typeof values.danhMuc === 'number' ? values.danhMuc : undefined,
        hethang: values.coSan === false
      };
      const res = await axios.post(`${ip3}/menus/items`, payload);
      const mamon = res.data?.mamon || payload.mamon;
      
      if (values.file) {
        const formData = new FormData();
        formData.append("file", values.file);
        await axios.post(`${ip3}/menus/items/${mamon}/upload-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      // Wait for completion and refresh
      fetchItems();
      return payload;
    } catch (error) {
      console.error("Failed to add menu item", error);
      throw error;
    }
  }, [fetchItems]);

  const updateMon = useCallback(async (values: any) => {
    try {
      const payload = {
        ten: values.ten,
        gia: values.giaBan,
        mieuta: values.moTa,
        danhmucid: typeof values.danhMuc === 'number' ? values.danhMuc : undefined,
      };
      await axios.patch(`${ip3}/menus/items/${values.id}`, payload);
      
      if (values.file) {
        const formData = new FormData();
        formData.append("file", values.file);
        await axios.post(`${ip3}/menus/items/${values.id}/upload-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      fetchItems();
    } catch (error) {
      console.error("Failed to update menu item", error);
      throw error;
    }
  }, [fetchItems]);

  const deleteMon = useCallback(async (id: string) => {
    try {
      await axios.delete(`${ip3}/menus/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Failed to delete menu item", error);
      throw error;
    }
  }, [fetchItems]);

  const toggleCoSan = useCallback(async (id: string, coSan: boolean) => {
    // In our backend, there is toggle-status which flips hethang
    // To explicitly set it, maybe we should just PATCH /items/{id} with { hethang: !coSan }
    try {
      await axios.patch(`${ip3}/menus/items/${id}`, { hethang: !coSan });
      fetchItems();
    } catch (error) {
      console.error("Failed to toggle menu item", error);
      throw error;
    }
  }, [fetchItems]);

  return { items, categories, tabCounts, addMon, updateMon, deleteMon, toggleCoSan, refresh: fetchItems };
}
