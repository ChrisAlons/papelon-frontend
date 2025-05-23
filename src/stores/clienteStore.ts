// src/stores/clienteStore.ts
import { create } from 'zustand';
import type { Cliente } from '../types/Cliente';
import { useUserStore } from './userStore';

interface ClienteState {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
  fetchClientes: () => Promise<void>;
  addCliente: (cli: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCliente: (id: number, cli: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteCliente: (id: number) => Promise<void>;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/clientes`;

export const useClienteStore = create<ClienteState>((set, get) => ({
  clientes: [],
  loading: false,
  error: null,
  fetchClientes: async () => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().basicAuth;
      const res = await fetch(API_URL, { headers: token ? { Authorization: token } : {} });
      if (!res.ok) throw new Error('Error al obtener clientes');
      const raw = await res.json();
      set({ clientes: raw.data ?? [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  addCliente: async (cli) => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().basicAuth;
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: token } : {}) },
        body: JSON.stringify(cli),
      });
      if (!res.ok) throw new Error('Error al crear cliente');
      await get().fetchClientes();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  updateCliente: async (id, cli) => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().basicAuth;
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: token } : {}) },
        body: JSON.stringify(cli),
      });
      if (!res.ok) throw new Error('Error al actualizar cliente');
      await get().fetchClientes();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  deleteCliente: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().basicAuth;
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: token ? { Authorization: token } : {} });
      if (!res.ok) throw new Error('Error al eliminar cliente');
      await get().fetchClientes();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));
