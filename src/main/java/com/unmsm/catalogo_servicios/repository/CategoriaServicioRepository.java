package com.unmsm.catalogo_servicios.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.unmsm.catalogo_servicios.model.CategoriaServicio;

@Repository
public interface CategoriaServicioRepository extends JpaRepository<CategoriaServicio, Long> {
    
    // Buscar categoría por nombre
    Optional<CategoriaServicio> findByNombre(String nombre);
    
    // Verificar si existe una categoría con ese nombre
    boolean existsByNombre(String nombre);
}