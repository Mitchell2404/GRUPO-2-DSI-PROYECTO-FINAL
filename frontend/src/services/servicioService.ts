import api from './api';
import { Servicio, EstadoServicio } from '../types';

export const servicioService = {
  getAll: async (): Promise<Servicio[]> => {
    const response = await api.get('/servicios');
    return response.data;
  },

  getActivos: async (): Promise<Servicio[]> => {
    const response = await api.get('/servicios/activos');
    return response.data;
  },

  getById: async (id: number): Promise<Servicio> => {
    const response = await api.get(`/servicios/${id}`);
    return response.data;
  },

  getByCategoria: async (categoriaId: number): Promise<Servicio[]> => {
    const response = await api.get(`/servicios/categoria/${categoriaId}`);
    return response.data;
  },

  search: async (nombre: string): Promise<Servicio[]> => {
    const response = await api.get(`/servicios/buscar?nombre=${nombre}`);
    return response.data;
  },

  create: async (servicio: Servicio): Promise<Servicio> => {
    const response = await api.post('/servicios', servicio);
    return response.data;
  },

  update: async (id: number, servicio: Servicio): Promise<Servicio> => {
    const response = await api.put(`/servicios/${id}`, servicio);
    return response.data;
  },

  cambiarEstado: async (id: number, estado: EstadoServicio): Promise<Servicio> => {
    const response = await api.patch(`/servicios/${id}/estado?estado=${estado}`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/servicios/${id}`);
  },
};