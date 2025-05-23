import { create } from "zustand";
import type { Usuario } from "../types/Usuario";

interface UserState {
  users: Usuario[];
  loading: boolean;
  error: string | null;
  currentUser: Usuario | null;
  basicAuth: string | null;
  fetchUsers: () => Promise<void>;
  login: (username: string, password: string) => Promise<Usuario>;
  logout: () => void;
  addUser: (user: { username: string; password: string; rol: string;  }) => Promise<void>;
  updateUser: (id: number, user: { username: string; rol: string }) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/usuarios`; // Reemplaza con la URL de tu API

const storedToken = localStorage.getItem('basicAuth');

export const useUserStore = create<UserState & { loadingUsers: boolean }>((set, get) => {
  const store: UserState & { loadingUsers: boolean } = {
    users: [],
    loading: false,
    loadingUsers: false,
    error: null,
    currentUser: null,
    basicAuth: storedToken,

    fetchUsers: async () => {
      // Evitar llamadas concurrentes solo para usuarios
      if (get().loadingUsers) return;
      set({ loadingUsers: true, error: null });
      try {
        const headers: Record<string,string> = {};
        const token = get().basicAuth;
        if (token) headers.Authorization = token;
        const res = await fetch(API_URL, { headers });
        if (!res.ok) throw new Error("Error al obtener usuarios");
        const raw = await res.json();
        set({ users: Array.isArray(raw.data) ? raw.data : [], loadingUsers: false });
      } catch (error: any) {
        set({ error: error.message, loadingUsers: false });
      }
    },

    login: async (username, password) => {
      set({ loading: true, error: null });
      const token = `Basic ${btoa(`${username}:${password}`)}`;
      try {
        const res = await fetch(`${API_URL}/me`, { headers: { Authorization: token } });
        if (res.status === 403) throw new Error('Acceso denegado: usuario sin permisos para iniciar sesión');
        if (!res.ok) throw new Error('Credenciales inválidas');
        const raw = await res.json();
        set({ currentUser: raw.data, basicAuth: token, loading: false });
        localStorage.setItem('basicAuth', token);
        return raw.data;
      } catch (error: any) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },

    logout: () => {
      set({ currentUser: null, basicAuth: null });
      localStorage.removeItem('basicAuth');
    },

    addUser: async (user) => {
      set({ loading: true, error: null });
      try {
        const token = get().basicAuth;
        const headers: Record<string,string> = { "Content-Type": "application/json" };
        if (token) headers.Authorization = token;
        const res = await fetch(API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error("Error al crear usuario");
        await get().fetchUsers();
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },

    updateUser: async (id, user) => {
      set({ loading: true, error: null });
      try {
        const token = get().basicAuth;
        const headers: Record<string,string> = { "Content-Type": "application/json" };
        if (token) headers.Authorization = token;
        const res = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error("Error al actualizar usuario");
        await get().fetchUsers();
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },

    fetchCurrentUser: async () => {
      const token = get().basicAuth;
      if (!token) return;
      set({ loading: true, error: null });
      try {
        const res = await fetch(`${API_URL}/me`, { headers: { Authorization: token } });
        if (res.ok) {
          const raw = await res.json();
          set({ currentUser: raw.data });
        }
      } catch (error) {
        /* ignore */
      } finally {
        set({ loading: false });
      }
    },
  };

  // Restaurar sesión automáticamente si hay token y no hay currentUser
  const token = localStorage.getItem('basicAuth');
  if (token && !store.currentUser) {
    fetch(`${API_URL}/me`, { headers: { Authorization: token } })
      .then(res => res.ok ? res.json() : null)
      .then(raw => {
        if (raw && raw.data) {
          set({ currentUser: raw.data, basicAuth: token });
        }
      });
  }

  return store;
});
