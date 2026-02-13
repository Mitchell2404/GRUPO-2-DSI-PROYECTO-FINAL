package com.unmsm.catalogo_servicios.controller;

import com.unmsm.catalogo_servicios.model.Servicio;
import com.unmsm.catalogo_servicios.model.enums.EstadoServicio;
import com.unmsm.catalogo_servicios.service.ServicioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
                .orElse(ResponseEntity.notFound().build());
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
    public ResponseEntity<?> crear(@Valid @RequestBody Servicio servicio) {
        try {
            Servicio nuevoServicio = servicioService.guardar(servicio);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoServicio);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // PUT /api/servicios/{id} - Actualizar servicio
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody Servicio servicio) {
        try {
            if (!servicioService.buscarPorId(id).isPresent()) {
                return ResponseEntity.notFound().build();
            }
            servicio.setId(id);
            Servicio servicioActualizado = servicioService.guardar(servicio);
            return ResponseEntity.ok(servicioActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // PATCH /api/servicios/{id}/estado - Cambiar estado (activar/desactivar)
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam EstadoServicio estado) {
        try {
            Servicio servicio = servicioService.cambiarEstado(id, estado);
            return ResponseEntity.ok(servicio);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // DELETE /api/servicios/{id} - Eliminar servicio
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            servicioService.eliminar(id);
            return ResponseEntity.ok().body("Servicio eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}