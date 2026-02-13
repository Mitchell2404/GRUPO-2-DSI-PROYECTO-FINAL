package com.unmsm.catalogo_servicios.service;

import com.unmsm.catalogo_servicios.model.CategoriaServicio;
import com.unmsm.catalogo_servicios.repository.CategoriaServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaServicioService {
    
    @Autowired
    private CategoriaServicioRepository categoriaRepository;
    
    // Listar todas las categorías
    public List<CategoriaServicio> listarTodas() {
        return categoriaRepository.findAll();
    }
    
    // Buscar categoría por ID
    public Optional<CategoriaServicio> buscarPorId(Long id) {
        return categoriaRepository.findById(id);
    }
    
    // Buscar categoría por nombre
    public Optional<CategoriaServicio> buscarPorNombre(String nombre) {
        return categoriaRepository.findByNombre(nombre);
    }
    
    // Crear o actualizar categoría
    public CategoriaServicio guardar(CategoriaServicio categoria) {
        // Validar que el nombre no esté duplicado (solo al crear)
        if (categoria.getId() == null && categoriaRepository.existsByNombre(categoria.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }
        return categoriaRepository.save(categoria);
    }
    
    // Eliminar categoría
    public void eliminar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada");
        }
        categoriaRepository.deleteById(id);
    }
}