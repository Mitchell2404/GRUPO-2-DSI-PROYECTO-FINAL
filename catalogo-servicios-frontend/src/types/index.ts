// Enums
export enum RolUsuario {
  ADMIN = 'ADMIN',
  CLIENTE = 'CLIENTE',
  SOPORTE = 'SOPORTE'
}

export enum EstadoServicio {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO'
}

export enum EstadoSolicitud {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO'
}

// Interfaces
export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  fechaRegistro?: string;
}

export interface CategoriaServicio {
  id?: number;
  nombre: string;
  descripcion: string;
}

export interface Servicio {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: CategoriaServicio;
  estado: EstadoServicio;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface SolicitudServicio {
  id?: number;
  usuario: Usuario;
  servicio: Servicio;
  fechaSolicitud?: string;
  estado: EstadoSolicitud;
  fechaRespuesta?: string;
  observaciones?: string;
}