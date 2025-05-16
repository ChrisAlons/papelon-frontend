import { create } from "zustand";
import type { Producto } from "../types/Producto";

// Tipo para crear producto (sin id, createdAt ni updatedAt)
export type ProductoCrear = Omit<Producto, "id" | "createdAt" | "updatedAt">;

interface ProductState {
  products: Producto[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: ProductoCrear) => Promise<void>;
  updateProduct: (id: number, product: ProductoCrear) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/productos`;

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al obtener productos");
      const raw = await res.json();
      set({ products: raw.data ?? [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Error al crear producto");
      await get().fetchProducts();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateProduct: async (id, product) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Error al actualizar producto");
      await get().fetchProducts();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar producto");
      await get().fetchProducts();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
