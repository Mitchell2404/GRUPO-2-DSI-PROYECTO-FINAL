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
import com.unmsm.catalogo_servicios.model.Usuario;
import com.unmsm.catalogo_servicios.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    // GET /api/usuarios - Listar todos los usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }
    
    // GET /api/usuarios/{id} - Buscar usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
    }
    
    // GET /api/usuarios/correo/{correo} - Buscar por correo
    @GetMapping("/correo/{correo}")
    public ResponseEntity<Usuario> buscarPorCorreo(@PathVariable String correo) {
        return usuarioService.buscarPorCorreo(correo)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con correo: " + correo));
    }
    
    // POST /api/usuarios - Crear nuevo usuario
    @PostMapping
    public ResponseEntity<Usuario> crear(@Valid @RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.guardar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }
    
    // PUT /api/usuarios/{id} - Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @Valid @RequestBody Usuario usuario) {
        if (!usuarioService.buscarPorId(id).isPresent()) {
            throw new ResourceNotFoundException("Usuario no encontrado con ID: " + id);
        }
        usuario.setId(id);
        Usuario usuarioActualizado = usuarioService.guardar(usuario);
        return ResponseEntity.ok(usuarioActualizado);
    }
    
    // DELETE /api/usuarios/{id} - Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}