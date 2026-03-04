import api from './api';
import { CategoriaServicio } from '../types';

export const categoriaService = {
  getAll: async (): Promise<CategoriaServicio[]> => {
    const response = await api.get('/categorias');
    return response.data;
  },

  getById: async (id: number): Promise<CategoriaServicio> => {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  create: async (categoria: CategoriaServicio): Promise<CategoriaServicio> => {
    const response = await api.post('/categorias', categoria);
    return response.data;
  },

  update: async (id: number, categoria: CategoriaServicio): Promise<CategoriaServicio> => {
    const response = await api.put(`/categorias/${id}`, categoria);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};