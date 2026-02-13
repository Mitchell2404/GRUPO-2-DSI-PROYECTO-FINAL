package com.unmsm.catalogo_servicios.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unmsm.catalogo_servicios.model.CategoriaServicio;
import com.unmsm.catalogo_servicios.model.Servicio;
import com.unmsm.catalogo_servicios.model.enums.EstadoServicio;
import com.unmsm.catalogo_servicios.repository.CategoriaServicioRepository;
import com.unmsm.catalogo_servicios.repository.ServicioRepository;

@Service
public class ServicioService {
    
    @Autowired
    private ServicioRepository servicioRepository;
    
    @Autowired
    private CategoriaServicioRepository categoriaRepository;
    
    // Listar todos los servicios
    public List<Servicio> listarTodos() {
        return servicioRepository.findAll();
    }
    
    // Listar solo servicios activos
    public List<Servicio> listarActivos() {
        return servicioRepository.findByEstado(EstadoServicio.ACTIVO);
    }
    
    // Buscar servicio por ID
    public Optional<Servicio> buscarPorId(Long id) {
        return servicioRepository.findById(id);
    }
    
    // Buscar servicios por categoría
    public List<Servicio> buscarPorCategoria(Long categoriaId) {
        return servicioRepository.findByCategoriaId(categoriaId);
    }
    
    // Buscar servicios activos de una categoría
    public List<Servicio> buscarActivosPorCategoria(Long categoriaId) {
        return servicioRepository.findByCategoriaIdAndEstado(categoriaId, EstadoServicio.ACTIVO);
    }
    
    // Buscar servicios por nombre (búsqueda)
    public List<Servicio> buscarPorNombre(String nombre) {
        return servicioRepository.findByNombreContainingIgnoreCase(nombre);
    }
    
    // Crear o actualizar servicio
    public Servicio guardar(Servicio servicio) {
    // Validar que la categoría exista y cargarla completamente
        if (servicio.getCategoria() != null && servicio.getCategoria().getId() != null) {
            CategoriaServicio categoria = categoriaRepository.findById(servicio.getCategoria().getId())
                .orElseThrow(() -> new RuntimeException("La categoría no existe"));
            servicio.setCategoria(categoria);
        } else {
            throw new RuntimeException("Debe especificar una categoría");
        }
    
        return servicioRepository.save(servicio);
    }
    
    // Cambiar estado del servicio (activar/desactivar)
    public Servicio cambiarEstado(Long id, EstadoServicio nuevoEstado) {
        Servicio servicio = servicioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        servicio.setEstado(nuevoEstado);
        return servicioRepository.save(servicio);
    }
    
    // Eliminar servicio
    public void eliminar(Long id) {
        if (!servicioRepository.existsById(id)) {
            throw new RuntimeException("Servicio no encontrado");
        }
        servicioRepository.deleteById(id);
    }
}