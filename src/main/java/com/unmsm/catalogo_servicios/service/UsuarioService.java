package com.unmsm.catalogo_servicios.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unmsm.catalogo_servicios.exception.BadRequestException;
import com.unmsm.catalogo_servicios.exception.ResourceNotFoundException;
import com.unmsm.catalogo_servicios.model.Usuario;
import com.unmsm.catalogo_servicios.repository.UsuarioRepository;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }
    
    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }
    
    public Optional<Usuario> buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }
    
    public Usuario guardar(Usuario usuario) {
        if (usuario.getId() == null && usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new BadRequestException("El correo ya está registrado");
        }
        return usuarioRepository.save(usuario);
    }
    
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }
    
    public boolean existeCorreo(String correo) {
        return usuarioRepository.existsByCorreo(correo);
    }
}