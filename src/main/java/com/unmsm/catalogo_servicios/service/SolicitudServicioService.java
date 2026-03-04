package com.unmsm.catalogo_servicios.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unmsm.catalogo_servicios.exception.BadRequestException;
import com.unmsm.catalogo_servicios.exception.ResourceNotFoundException;
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
    
    public List<SolicitudServicio> listarTodas() {
        return solicitudRepository.findAll();
    }
    
    public Optional<SolicitudServicio> buscarPorId(Long id) {
        return solicitudRepository.findById(id);
    }
    
    public List<SolicitudServicio> listarPorUsuario(Long usuarioId) {
        return solicitudRepository.findByUsuarioId(usuarioId);
    }
    
    public List<SolicitudServicio> listarPorUsuarioOrdenadas(Long usuarioId) {
        return solicitudRepository.findByUsuarioIdOrderByFechaSolicitudDesc(usuarioId);
    }
    
    public List<SolicitudServicio> listarPorEstado(EstadoSolicitud estado) {
        return solicitudRepository.findByEstado(estado);
    }
    
    public SolicitudServicio crear(SolicitudServicio solicitud) {
        if (solicitud.getUsuario() != null && solicitud.getUsuario().getId() != null) {
            Usuario usuario = usuarioRepository.findById(solicitud.getUsuario().getId())
                .orElseThrow(() -> new ResourceNotFoundException("El usuario no existe con ID: " + solicitud.getUsuario().getId()));
            solicitud.setUsuario(usuario);
        } else {
            throw new BadRequestException("Debe especificar un usuario");
        }
        
        if (solicitud.getServicio() != null && solicitud.getServicio().getId() != null) {
            Servicio servicio = servicioRepository.findById(solicitud.getServicio().getId())
                .orElseThrow(() -> new ResourceNotFoundException("El servicio no existe con ID: " + solicitud.getServicio().getId()));
            solicitud.setServicio(servicio);
        } else {
            throw new BadRequestException("Debe especificar un servicio");
        }
        
        solicitud.setEstado(EstadoSolicitud.PENDIENTE);
        return solicitudRepository.save(solicitud);
    }
    
    public SolicitudServicio aprobar(Long id, String observaciones) {
        SolicitudServicio solicitud = solicitudRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con ID: " + id));
        
        solicitud.setEstado(EstadoSolicitud.APROBADO);
        solicitud.setFechaRespuesta(LocalDateTime.now());
        solicitud.setObservaciones(observaciones);
        
        return solicitudRepository.save(solicitud);
    }
    
    public SolicitudServicio rechazar(Long id, String observaciones) {
        SolicitudServicio solicitud = solicitudRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con ID: " + id));
        
        solicitud.setEstado(EstadoSolicitud.RECHAZADO);
        solicitud.setFechaRespuesta(LocalDateTime.now());
        solicitud.setObservaciones(observaciones);
        
        return solicitudRepository.save(solicitud);
    }
    
    public void eliminar(Long id) {
        if (!solicitudRepository.existsById(id)) {
            throw new ResourceNotFoundException("Solicitud no encontrada con ID: " + id);
        }
        solicitudRepository.deleteById(id);
    }
}