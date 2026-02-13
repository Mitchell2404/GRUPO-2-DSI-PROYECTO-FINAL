package com.unmsm.catalogo_servicios.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.unmsm.catalogo_servicios.model.SolicitudServicio;
import com.unmsm.catalogo_servicios.model.enums.EstadoSolicitud;

@Repository
public interface SolicitudServicioRepository extends JpaRepository<SolicitudServicio, Long> {
    
    // Buscar solicitudes por usuario
    List<SolicitudServicio> findByUsuarioId(Long usuarioId);
    
    // Buscar solicitudes por estado
    List<SolicitudServicio> findByEstado(EstadoSolicitud estado);
    
    // Buscar solicitudes por usuario y estado
    List<SolicitudServicio> findByUsuarioIdAndEstado(Long usuarioId, EstadoSolicitud estado);
    
    // Buscar solicitudes por servicio
    List<SolicitudServicio> findByServicioId(Long servicioId);
    
    // Ordenar solicitudes por fecha (las más recientes primero)
    List<SolicitudServicio> findByUsuarioIdOrderByFechaSolicitudDesc(Long usuarioId);
}