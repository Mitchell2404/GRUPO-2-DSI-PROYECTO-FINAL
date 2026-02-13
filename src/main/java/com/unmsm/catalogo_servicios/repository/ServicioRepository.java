package com.unmsm.catalogo_servicios.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.unmsm.catalogo_servicios.model.Servicio;
import com.unmsm.catalogo_servicios.model.enums.EstadoServicio;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {
    
    // Buscar servicios por estado (ACTIVO o INACTIVO)
    List<Servicio> findByEstado(EstadoServicio estado);
    
    // Buscar servicios por categoría
    List<Servicio> findByCategoriaId(Long categoriaId);
    
    // Buscar servicios activos de una categoría específica
    List<Servicio> findByCategoriaIdAndEstado(Long categoriaId, EstadoServicio estado);
    
    // Buscar servicios por nombre (búsqueda parcial, case insensitive)
    List<Servicio> findByNombreContainingIgnoreCase(String nombre);
}