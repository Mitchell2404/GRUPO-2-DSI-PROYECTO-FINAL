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

import com.unmsm.catalogo_servicios.exception.ResourceNotFoundException;
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
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + id));
    }
    
    // POST /api/categorias - Crear nueva categoría
    @PostMapping
    public ResponseEntity<CategoriaServicio> crear(@Valid @RequestBody CategoriaServicio categoria) {
        CategoriaServicio nuevaCategoria = categoriaService.guardar(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCategoria);
    }
    
    // PUT /api/categorias/{id} - Actualizar categoría
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaServicio> actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaServicio categoria) {
        if (!categoriaService.buscarPorId(id).isPresent()) {
            throw new ResourceNotFoundException("Categoría no encontrada con ID: " + id);
        }
        categoria.setId(id);
        CategoriaServicio categoriaActualizada = categoriaService.guardar(categoria);
        return ResponseEntity.ok(categoriaActualizada);
    }
    
    // DELETE /api/categorias/{id} - Eliminar categoría
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}