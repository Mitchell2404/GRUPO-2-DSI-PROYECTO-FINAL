package com.unmsm.catalogo_servicios.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unmsm.catalogo_servicios.exception.ResourceNotFoundException;
import com.unmsm.catalogo_servicios.model.SolicitudServicio;
import com.unmsm.catalogo_servicios.model.enums.EstadoSolicitud;
import com.unmsm.catalogo_servicios.service.SolicitudServicioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "*")
public class SolicitudServicioController {
    
    @Autowired
    private SolicitudServicioService solicitudService;
    
    // GET /api/solicitudes - Listar todas las solicitudes
    @GetMapping
    public ResponseEntity<List<SolicitudServicio>> listarTodas() {
        List<SolicitudServicio> solicitudes = solicitudService.listarTodas();
        return ResponseEntity.ok(solicitudes);
    }
    
    // GET /api/solicitudes/{id} - Buscar solicitud por ID
    @GetMapping("/{id}")
    public ResponseEntity<SolicitudServicio> buscarPorId(@PathVariable Long id) {
        return solicitudService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con ID: " + id));
    }
    
    // GET /api/solicitudes/usuario/{usuarioId} - Solicitudes de un usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<SolicitudServicio>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<SolicitudServicio> solicitudes = solicitudService.listarPorUsuarioOrdenadas(usuarioId);
        return ResponseEntity.ok(solicitudes);
    }
    
    // GET /api/solicitudes/estado/{estado} - Filtrar por estado
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<SolicitudServicio>> listarPorEstado(@PathVariable EstadoSolicitud estado) {
        List<SolicitudServicio> solicitudes = solicitudService.listarPorEstado(estado);
        return ResponseEntity.ok(solicitudes);
    }
    
    // POST /api/solicitudes - Crear nueva solicitud
    @PostMapping
    public ResponseEntity<SolicitudServicio> crear(@Valid @RequestBody SolicitudServicio solicitud) {
        SolicitudServicio nuevaSolicitud = solicitudService.crear(solicitud);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaSolicitud);
    }
    
    // PATCH /api/solicitudes/{id}/aprobar - Aprobar solicitud
    @PatchMapping("/{id}/aprobar")
    public ResponseEntity<SolicitudServicio> aprobar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String observaciones = body.getOrDefault("observaciones", "");
        SolicitudServicio solicitud = solicitudService.aprobar(id, observaciones);
        return ResponseEntity.ok(solicitud);
    }
    
    // PATCH /api/solicitudes/{id}/rechazar - Rechazar solicitud
    @PatchMapping("/{id}/rechazar")
    public ResponseEntity<SolicitudServicio> rechazar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String observaciones = body.getOrDefault("observaciones", "");
        SolicitudServicio solicitud = solicitudService.rechazar(id, observaciones);
        return ResponseEntity.ok(solicitud);
    }
    
    // DELETE /api/solicitudes/{id} - Eliminar solicitud
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        solicitudService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}