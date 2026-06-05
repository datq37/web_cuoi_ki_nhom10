import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { SyncAdapters } from '@/services/api/adapters';
import { IMonAn } from '@/services/QuanTri/Quản Lý Món/typing';

export default function useQuanLyMonModel() {
  const [items, setItems] = useState<IMonAn[]>([]);
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);

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

  const fetchIngredients = useCallback(async () => {
    try {
      const res = await axios.get(`${ip3}/inventory`);
      if (res.data && res.data.items) {
        setIngredients(res.data.items.map(SyncAdapters.mapAdminInventoryToUI));
      }
    } catch (error) {
      console.error("Failed to load inventory:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchItems();
    fetchIngredients();
  }, [fetchCategories, fetchItems, fetchIngredients]);

  const tabCounts = useMemo(() => {
    const counts: Record<string | number, number> = { tat_ca: items.length };
    categories.forEach(c => {
       counts[c.id] = items.filter(m => m.danhMuc === c.id).length;
    });
    return counts;
  }, [items, categories]);

  const addCategory = useCallback(async (values: { name: string; image?: string }) => {
    const res = await axios.post(`${ip3}/categories`, values);
    await fetchCategories();
    return res.data;
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id: number, values: { name?: string; image?: string }) => {
    const res = await axios.patch(`${ip3}/categories/${id}`, values);
    await fetchCategories();
    await fetchItems();
    return res.data;
  }, [fetchCategories, fetchItems]);

  const deleteCategory = useCallback(async (id: number) => {
    await axios.delete(`${ip3}/categories/${id}`);
    await fetchCategories();
    await fetchItems();
  }, [fetchCategories, fetchItems]);

  const uploadMenuImage = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(`${ip3}/uploads/image?folder=canteen/menu-items`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data?.url;
  }, []);

  const uploadCategoryImage = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(`${ip3}/uploads/image?folder=canteen/categories`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data?.url;
  }, []);

  const addMon = useCallback(async (values: any) => {
    try {
      const imageUrl = values.file ? await uploadMenuImage(values.file) : values.hinhAnh;
      const payload = {
        mamon: values.id || `MON${Math.floor(Math.random() * 1000000)}`,
        ten: values.ten,
        gia: values.giaBan,
        mieuta: values.moTa,
        hinhanh: imageUrl,
        danhmucid: typeof values.danhMuc === 'number' ? values.danhMuc : undefined,
        hethang: values.coSan === false,
        nguyenLieu: values.nguyenLieu || [],
      };
      await axios.post(`${ip3}/menus/items`, payload);
      // Wait for completion and refresh
      await fetchItems();
      return payload;
    } catch (error) {
      console.error("Failed to add menu item", error);
      throw error;
    }
  }, [fetchItems, uploadMenuImage]);

  const updateMon = useCallback(async (values: any) => {
    try {
      const imageUrl = values.file ? await uploadMenuImage(values.file) : values.hinhAnh;
      const payload = {
        ten: values.ten,
        gia: values.giaBan,
        mieuta: values.moTa,
        hinhanh: imageUrl,
        danhmucid: typeof values.danhMuc === 'number' ? values.danhMuc : undefined,
        nguyenLieu: values.nguyenLieu || [],
      };
      await axios.patch(`${ip3}/menus/items/${values.id}`, payload);
      await fetchItems();
    } catch (error) {
      console.error("Failed to update menu item", error);
      throw error;
    }
  }, [fetchItems, uploadMenuImage]);

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

  return {
    items,
    categories,
    ingredients,
    tabCounts,
    addMon,
    updateMon,
    deleteMon,
    toggleCoSan,
    addCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    refresh: fetchItems,
  };
}
