package com.unmsm.catalogo_servicios.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.unmsm.catalogo_servicios.exception.ResourceNotFoundException;
import com.unmsm.catalogo_servicios.model.Servicio;
import com.unmsm.catalogo_servicios.model.enums.EstadoServicio;
import com.unmsm.catalogo_servicios.service.ServicioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {
    
    @Autowired
    private ServicioService servicioService;
    
    // GET /api/servicios - Listar todos los servicios
    @GetMapping
    public ResponseEntity<List<Servicio>> listarTodos() {
        List<Servicio> servicios = servicioService.listarTodos();
        return ResponseEntity.ok(servicios);
    }
    
    // GET /api/servicios/activos - Listar solo servicios activos
    @GetMapping("/activos")
    public ResponseEntity<List<Servicio>> listarActivos() {
        List<Servicio> servicios = servicioService.listarActivos();
        return ResponseEntity.ok(servicios);
    }
    
    // GET /api/servicios/{id} - Buscar servicio por ID
    @GetMapping("/{id}")
    public ResponseEntity<Servicio> buscarPorId(@PathVariable Long id) {
        return servicioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado con ID: " + id));
    }
    
    // GET /api/servicios/categoria/{categoriaId} - Servicios por categoría
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<Servicio>> buscarPorCategoria(@PathVariable Long categoriaId) {
        List<Servicio> servicios = servicioService.buscarPorCategoria(categoriaId);
        return ResponseEntity.ok(servicios);
    }
    
    // GET /api/servicios/categoria/{categoriaId}/activos - Servicios activos por categoría
    @GetMapping("/categoria/{categoriaId}/activos")
    public ResponseEntity<List<Servicio>> buscarActivosPorCategoria(@PathVariable Long categoriaId) {
        List<Servicio> servicios = servicioService.buscarActivosPorCategoria(categoriaId);
        return ResponseEntity.ok(servicios);
    }
    
    // GET /api/servicios/buscar?nombre=xxx - Buscar por nombre
    @GetMapping("/buscar")
    public ResponseEntity<List<Servicio>> buscarPorNombre(@RequestParam String nombre) {
        List<Servicio> servicios = servicioService.buscarPorNombre(nombre);
        return ResponseEntity.ok(servicios);
    }
    
    // POST /api/servicios - Crear nuevo servicio
    @PostMapping
    public ResponseEntity<Servicio> crear(@Valid @RequestBody Servicio servicio) {
        Servicio nuevoServicio = servicioService.guardar(servicio);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoServicio);
    }
    
    // PUT /api/servicios/{id} - Actualizar servicio
    @PutMapping("/{id}")
    public ResponseEntity<Servicio> actualizar(@PathVariable Long id, @Valid @RequestBody Servicio servicio) {
        if (!servicioService.buscarPorId(id).isPresent()) {
            throw new ResourceNotFoundException("Servicio no encontrado con ID: " + id);
        }
        servicio.setId(id);
        Servicio servicioActualizado = servicioService.guardar(servicio);
        return ResponseEntity.ok(servicioActualizado);
    }
    
    // PATCH /api/servicios/{id}/estado - Cambiar estado (activar/desactivar)
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Servicio> cambiarEstado(@PathVariable Long id, @RequestParam EstadoServicio estado) {
        Servicio servicio = servicioService.cambiarEstado(id, estado);
        return ResponseEntity.ok(servicio);
    }
    
    // DELETE /api/servicios/{id} - Eliminar servicio
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}