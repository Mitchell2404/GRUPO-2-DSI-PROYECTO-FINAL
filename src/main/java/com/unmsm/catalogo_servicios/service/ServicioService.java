package com.unmsm.catalogo_servicios.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unmsm.catalogo_servicios.exception.BadRequestException;
import com.unmsm.catalogo_servicios.exception.ResourceNotFoundException;
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
    
    public List<Servicio> listarTodos() {
        return servicioRepository.findAll();
    }
    
    public List<Servicio> listarActivos() {
        return servicioRepository.findByEstado(EstadoServicio.ACTIVO);
    }
    
    public Optional<Servicio> buscarPorId(Long id) {
        return servicioRepository.findById(id);
    }
    
    public List<Servicio> buscarPorCategoria(Long categoriaId) {
        return servicioRepository.findByCategoriaId(categoriaId);
    }
    
    public List<Servicio> buscarActivosPorCategoria(Long categoriaId) {
        return servicioRepository.findByCategoriaIdAndEstado(categoriaId, EstadoServicio.ACTIVO);
    }
    
    public List<Servicio> buscarPorNombre(String nombre) {
        return servicioRepository.findByNombreContainingIgnoreCase(nombre);
    }
    
    public Servicio guardar(Servicio servicio) {
        if (servicio.getCategoria() != null && servicio.getCategoria().getId() != null) {
            CategoriaServicio categoria = categoriaRepository.findById(servicio.getCategoria().getId())
                .orElseThrow(() -> new ResourceNotFoundException("La categoría no existe con ID: " + servicio.getCategoria().getId()));
            servicio.setCategoria(categoria);
        } else {
            throw new BadRequestException("Debe especificar una categoría");
        }
        
        return servicioRepository.save(servicio);
    }
    
    public Servicio cambiarEstado(Long id, EstadoServicio nuevoEstado) {
        Servicio servicio = servicioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado con ID: " + id));
        servicio.setEstado(nuevoEstado);
        return servicioRepository.save(servicio);
    }
    
    public void eliminar(Long id) {
        if (!servicioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Servicio no encontrado con ID: " + id);
        }
        servicioRepository.deleteById(id);
    }
}