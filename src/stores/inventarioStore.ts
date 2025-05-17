import { create } from "zustand";
import type { Inventario } from "../types/Inventario";

interface InventarioState {
  inventarios: Inventario[];
  loading: boolean;
  error: string | null;
  fetchInventario: () => Promise<void>;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/inventario`;

export const useInventarioStore = create<InventarioState>((set) => ({
  inventarios: [],
  loading: false,
  error: null,
  fetchInventario: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al obtener inventario");
      const raw = await res.json();
      set({ inventarios: raw.data ?? [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
