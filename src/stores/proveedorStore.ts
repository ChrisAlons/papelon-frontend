// src/stores/proveedorStore.ts
import { create } from 'zustand';
import type { Proveedor } from '../types/Proveedor';

interface ProveedorState {
  proveedores: Proveedor[];
  loading: boolean;
  error: string | null;
  fetchProveedores: () => Promise<void>;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/proveedores`;

export const useProveedorStore = create<ProveedorState>((set) => ({
  proveedores: [],
  loading: false,
  error: null,
  fetchProveedores: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al obtener proveedores');
      const raw = await res.json();
      set({ proveedores: raw.data ?? [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
