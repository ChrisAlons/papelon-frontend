// src/stores/proveedorStore.ts
import { create } from 'zustand';
import { useUserStore } from './userStore';
import type { Proveedor } from '../types/Proveedor';

interface ProveedorState {
  proveedores: Proveedor[];
  loading: boolean;
  error: string | null;
  fetchProveedores: () => Promise<void>;
  addProveedor: (prov: Omit<Proveedor, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProveedor: (id: number, prov: Omit<Proveedor, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteProveedor: (id: number) => Promise<void>;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/proveedores`;

export const useProveedorStore = create<ProveedorState>((set, get) => ({
  proveedores: [],
  loading: false,
  error: null,
  fetchProveedores: async () => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().basicAuth;
      const res = await fetch(API_URL, { headers: token ? { Authorization: token } : {} });
      if (!res.ok) throw new Error('Error al obtener proveedores');
      const raw = await res.json();
      set({ proveedores: raw.data ?? [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  addProveedor: async (prov) => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().basicAuth;
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', ...(token ? { Authorization: token } : {})},
        body: JSON.stringify(prov),
      });
      if (!res.ok) throw new Error('Error al crear proveedor');
      await get().fetchProveedores();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  updateProveedor: async (id, prov) => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().basicAuth;
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', ...(token ? { Authorization: token } : {})},
        body: JSON.stringify(prov),
      });
      if (!res.ok) throw new Error('Error al actualizar proveedor');
      await get().fetchProveedores();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  deleteProveedor: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().basicAuth;
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: token ? { Authorization: token } : {} });
      if (!res.ok) throw new Error('Error al eliminar proveedor');
      await get().fetchProveedores();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
