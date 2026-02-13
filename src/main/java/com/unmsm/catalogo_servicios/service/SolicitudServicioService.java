package com.unmsm.catalogo_servicios.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unmsm.catalogo_servicios.model.Servicio;
import com.unmsm.catalogo_servicios.model.SolicitudServicio;
import com.unmsm.catalogo_servicios.model.Usuario;
import com.unmsm.catalogo_servicios.model.enums.EstadoSolicitud;
import com.unmsm.catalogo_servicios.repository.ServicioRepository;
import com.unmsm.catalogo_servicios.repository.SolicitudServicioRepository;
import com.unmsm.catalogo_servicios.repository.UsuarioRepository;

@Service
public class SolicitudServicioService {
    
    @Autowired
    private SolicitudServicioRepository solicitudRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ServicioRepository servicioRepository;
    
    // Listar todas las solicitudes
    public List<SolicitudServicio> listarTodas() {
        return solicitudRepository.findAll();
    }
    
    // Buscar solicitud por ID
    public Optional<SolicitudServicio> buscarPorId(Long id) {
        return solicitudRepository.findById(id);
    }
    
    // Listar solicitudes de un usuario
    public List<SolicitudServicio> listarPorUsuario(Long usuarioId) {
        return solicitudRepository.findByUsuarioId(usuarioId);
    }
    
    // Listar solicitudes de un usuario ordenadas por fecha
    public List<SolicitudServicio> listarPorUsuarioOrdenadas(Long usuarioId) {
        return solicitudRepository.findByUsuarioIdOrderByFechaSolicitudDesc(usuarioId);
    }
    
    // Listar solicitudes por estado
    public List<SolicitudServicio> listarPorEstado(EstadoSolicitud estado) {
        return solicitudRepository.findByEstado(estado);
    }
    
    // Crear nueva solicitud
    public SolicitudServicio crear(SolicitudServicio solicitud) {
        // Cargar el usuario completo desde la BD
        if (solicitud.getUsuario() != null && solicitud.getUsuario().getId() != null) {
            Usuario usuario = usuarioRepository.findById(solicitud.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("El usuario no existe"));
            solicitud.setUsuario(usuario);
        } else {
            throw new RuntimeException("Debe especificar un usuario");
        }
        
        // Cargar el servicio completo desde la BD
        if (solicitud.getServicio() != null && solicitud.getServicio().getId() != null) {
            Servicio servicio = servicioRepository.findById(solicitud.getServicio().getId())
                .orElseThrow(() -> new RuntimeException("El servicio no existe"));
            solicitud.setServicio(servicio);
        } else {
            throw new RuntimeException("Debe especificar un servicio");
        }
        
        // Establecer estado inicial
        solicitud.setEstado(EstadoSolicitud.PENDIENTE);
        
        return solicitudRepository.save(solicitud);
    }
    
    // Aprobar solicitud
    public SolicitudServicio aprobar(Long id, String observaciones) {
        SolicitudServicio solicitud = solicitudRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        
        solicitud.setEstado(EstadoSolicitud.APROBADO);
        solicitud.setFechaRespuesta(LocalDateTime.now());
        solicitud.setObservaciones(observaciones);
        
        return solicitudRepository.save(solicitud);
    }
    
    // Rechazar solicitud
    public SolicitudServicio rechazar(Long id, String observaciones) {
        SolicitudServicio solicitud = solicitudRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        
        solicitud.setEstado(EstadoSolicitud.RECHAZADO);
        solicitud.setFechaRespuesta(LocalDateTime.now());
        solicitud.setObservaciones(observaciones);
        
        return solicitudRepository.save(solicitud);
    }
    
    // Eliminar solicitud
    public void eliminar(Long id) {
        if (!solicitudRepository.existsById(id)) {
            throw new RuntimeException("Solicitud no encontrada");
        }
        solicitudRepository.deleteById(id);
    }
}