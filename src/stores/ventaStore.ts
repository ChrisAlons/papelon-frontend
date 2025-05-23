// src/stores/ventaStore.ts
import { create } from 'zustand';
import { useUserStore } from './userStore';
import type { Venta } from '../types/Venta';
import type { VentaRequest } from '../types/VentaRequest';

interface VentaState {
  ventas: Venta[];
  loading: boolean;
  error: string | null;
  fetchVentas: () => Promise<void>;
  createVenta: (venta: VentaRequest) => Promise<void>;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/ventas`;

export const useVentaStore = create<VentaState>((set, get) => ({
  ventas: [],
  loading: false,
  error: null,
  fetchVentas: async () => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().basicAuth;
      const res = await fetch(API_URL, { headers: token ? { Authorization: token } : {} });
      if (!res.ok) throw new Error('Error al obtener ventas');
      const raw = await res.json();
      set({ ventas: raw.data ?? [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  createVenta: async (venta) => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().basicAuth;
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: token } : {}) },
        body: JSON.stringify(venta),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Error al crear venta');
      }
      await get().fetchVentas();
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));
