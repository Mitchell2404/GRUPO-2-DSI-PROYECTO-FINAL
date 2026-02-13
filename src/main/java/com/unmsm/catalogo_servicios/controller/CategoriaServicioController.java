package com.unmsm.catalogo_servicios.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unmsm.catalogo_servicios.model.CategoriaServicio;
import com.unmsm.catalogo_servicios.service.CategoriaServicioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriaServicioController {
    
    @Autowired
    private CategoriaServicioService categoriaService;
    
    // GET /api/categorias - Listar todas las categorías
    @GetMapping
    public ResponseEntity<List<CategoriaServicio>> listarTodas() {
        List<CategoriaServicio> categorias = categoriaService.listarTodas();
        return ResponseEntity.ok(categorias);
    }
    
    // GET /api/categorias/{id} - Buscar categoría por ID
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaServicio> buscarPorId(@PathVariable Long id) {
        return categoriaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // POST /api/categorias - Crear nueva categoría
    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody CategoriaServicio categoria) {
        try {
            CategoriaServicio nuevaCategoria = categoriaService.guardar(categoria);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCategoria);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // PUT /api/categorias/{id} - Actualizar categoría
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaServicio categoria) {
        try {
            if (!categoriaService.buscarPorId(id).isPresent()) {
                return ResponseEntity.notFound().build();
            }
            categoria.setId(id);
            CategoriaServicio categoriaActualizada = categoriaService.guardar(categoria);
            return ResponseEntity.ok(categoriaActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // DELETE /api/categorias/{id} - Eliminar categoría
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            categoriaService.eliminar(id);
            return ResponseEntity.ok().body("Categoría eliminada correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}