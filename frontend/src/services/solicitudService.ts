import api from './api';
import { SolicitudServicio, EstadoSolicitud } from '../types';

export const solicitudService = {
  getAll: async (): Promise<SolicitudServicio[]> => {
    const response = await api.get('/solicitudes');
    return response.data;
  },

  getById: async (id: number): Promise<SolicitudServicio> => {
    const response = await api.get(`/solicitudes/${id}`);
    return response.data;
  },

  getByUsuario: async (usuarioId: number): Promise<SolicitudServicio[]> => {
    const response = await api.get(`/solicitudes/usuario/${usuarioId}`);
    return response.data;
  },

  getByEstado: async (estado: EstadoSolicitud): Promise<SolicitudServicio[]> => {
    const response = await api.get(`/solicitudes/estado/${estado}`);
    return response.data;
  },

  create: async (solicitud: { usuarioId: number; servicioId: number }): Promise<SolicitudServicio> => {
    const response = await api.post('/solicitudes', {
      usuario: { id: solicitud.usuarioId },
      servicio: { id: solicitud.servicioId }
    });
    return response.data;
  },

  aprobar: async (id: number, observaciones: string): Promise<SolicitudServicio> => {
    const response = await api.patch(`/solicitudes/${id}/aprobar`, { observaciones });
    return response.data;
  },

  rechazar: async (id: number, observaciones: string): Promise<SolicitudServicio> => {
    const response = await api.patch(`/solicitudes/${id}/rechazar`, { observaciones });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/solicitudes/${id}`);
  },
};