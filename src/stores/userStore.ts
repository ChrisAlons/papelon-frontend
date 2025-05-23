import { create } from "zustand";
import type { Usuario } from "../types/Usuario";

interface UserState {
  users: Usuario[];
  loading: boolean;
  error: string | null;
  currentUser: Usuario | null;
  basicAuth: string | null;
  fetchUsers: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  addUser: (user: { username: string; password: string; rol: string;  }) => Promise<void>;
  updateUser: (id: number, user: { username: string; rol: string }) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/usuarios`; // Reemplaza con la URL de tu API

const storedToken = localStorage.getItem('basicAuth');

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  currentUser: null,
  basicAuth: storedToken,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const headers: Record<string,string> = {};
      const token = get().basicAuth;
      if (token) headers.Authorization = token;
      const res = await fetch(API_URL, { headers });
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const raw = await res.json();
      set({ users: Array.isArray(raw.data) ? raw.data : [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  login: async (username, password) => {
    set({ loading: true, error: null });
    const token = `Basic ${btoa(`${username}:${password}`)}`;
    try {
      const res = await fetch(`${API_URL}/me`, { headers: { Authorization: token } });
      if (!res.ok) throw new Error('Credenciales inválidas');
      const raw = await res.json();
      set({ currentUser: raw.data, basicAuth: token, loading: false });
      localStorage.setItem('basicAuth', token);
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
}));
