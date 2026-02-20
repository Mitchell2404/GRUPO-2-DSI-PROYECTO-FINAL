import api from './api';
import type { Usuario } from '../types';

export const usuarioService = {
  getAll: async (): Promise<Usuario[]> => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  getById: async (id: number): Promise<Usuario> => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  getByCorreo: async (correo: string): Promise<Usuario> => {
    const response = await api.get(`/usuarios/correo/${correo}`);
    return response.data;
  },

  create: async (usuario: Usuario): Promise<Usuario> => {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  },

  update: async (id: number, usuario: Usuario): Promise<Usuario> => {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },
};