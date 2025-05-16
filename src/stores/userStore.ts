import { create } from "zustand";
import type { Usuario } from "../types/Usuario";

interface UserState {
  users: Usuario[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: { username: string; password: string; rol: string;  }) => Promise<void>;
  updateUser: (id: number, user: { username: string; rol: string }) => Promise<void>;
  // deleteUser: (id: number) => Promise<void>;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/usuarios`; // Reemplaza con la URL de tu API

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
  set({ loading: true, error: null });
  try {
		console.log("API_URL:", API_URL);
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener usuarios");
    const raw = await res.json();
    // Guarda los usuarios que vienen en raw.data
    set({ users: Array.isArray(raw.data) ? raw.data : [], loading: false });
  } catch (error: any) {
    set({ error: error.message, loading: false });
  }
},


  addUser: async (user) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error("Error al actualizar usuario");
      await get().fetchUsers();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  // deleteUser: async (id) => {
  //   set({ loading: true, error: null });
  //   try {
  //     const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  //     if (!res.ok) throw new Error("Error al eliminar usuario");
  //     await get().fetchUsers();
  //   } catch (error: any) {
  //     set({ error: error.message, loading: false });
  //   }
  // },
}));
