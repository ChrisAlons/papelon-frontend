import { create } from "zustand";
import type { Compra } from "../types/Compra";
import { useUserStore } from "./userStore";

interface CompraState {
  compras: Compra[];
  loading: boolean;
  error: string | null;
  fetchCompras: () => Promise<void>;
  createCompra: (compra: import('../types/CompraRequest').CompraRequest) => Promise<void>;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/compras`;

export const useCompraStore = create<CompraState>((set, get) => ({
  compras: [],
  loading: false,
  error: null,
  fetchCompras: async () => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().basicAuth;
      const res = await fetch(API_URL, { headers: token ? { Authorization: token } : {} });
      if (!res.ok) throw new Error("Error al obtener compras");
      const raw = await res.json();
      set({ compras: raw.data ?? [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  createCompra: async (compra) => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().basicAuth;
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: token } : {}) },
        body: JSON.stringify(compra),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Error al crear compra');
      }
      await get().fetchCompras();
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  }
}));
