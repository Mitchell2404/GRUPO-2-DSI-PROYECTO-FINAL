package com.unmsm.catalogo_servicios.repository;

import com.unmsm.catalogo_servicios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Método personalizado: buscar usuario por correo
    Optional<Usuario> findByCorreo(String correo);
    
    // Método personalizado: verificar si existe un correo
    boolean existsByCorreo(String correo);
}