// src/api/usuarioService.ts
import api from './apiClient';
import type {Usuario} from "../types/Usuario";

export const fetchUsuarios = async (): Promise<Usuario[]> => {
  const res = await api.get<{ success: boolean; data: Usuario[] }>('/usuarios');
  return res.data.data;
};
