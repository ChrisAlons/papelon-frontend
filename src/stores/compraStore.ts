import { create } from "zustand";
import type { Compra } from "../types/Compra";

interface CompraState {
  compras: Compra[];
  loading: boolean;
  error: string | null;
  fetchCompras: () => Promise<void>;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/compras`;

export const useCompraStore = create<CompraState>((set) => ({
  compras: [],
  loading: false,
  error: null,
  fetchCompras: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al obtener compras");
      const raw = await res.json();
      set({ compras: raw.data ?? [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));
