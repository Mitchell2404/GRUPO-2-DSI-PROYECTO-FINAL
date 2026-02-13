# 📚 Catálogo de Servicios - UNMSM

Sistema backend para la gestión centralizada de trámites y servicios universitarios.

## 🚀 Tecnologías

- **Java 17**
- **Spring Boot 3.x**
- **PostgreSQL** (Neon)
- **Maven**
- **JPA/Hibernate**

## 📋 Funcionalidades

- ✅ Gestión de Usuarios (ADMIN, CLIENTE, SOPORTE)
- ✅ Gestión de Categorías de Servicios
- ✅ Gestión de Servicios/Trámites
- ✅ Sistema de Solicitudes (Pendiente, Aprobado, Rechazado)
- ✅ API REST completa
- ✅ Manejo de excepciones personalizado
- ✅ Validaciones de datos

## 🛠️ Instalación

### Prerrequisitos

- Java 17 o superior
- Maven 3.6+
- Cuenta en Neon (PostgreSQL)

### Pasos

1. **Clonar el repositorio**
```bash
   git clone https://github.com/TU-USUARIO/catalogo-servicios-backend.git
   cd catalogo-servicios-backend
```

2. **Configurar base de datos**
   
   Copia el archivo de ejemplo:
```bash
   cp src/main/resources/application.properties.example src/main/resources/application.properties
```
   
   Edita `application.properties` con tus credenciales de Neon:
```properties
   spring.datasource.url=jdbc:postgresql://TU-ENDPOINT.neon.tech/TU-DB?sslmode=require
   spring.datasource.username=TU-USUARIO
   spring.datasource.password=TU-PASSWORD
```

3. **Ejecutar el proyecto**
```bash
   ./mvnw spring-boot:run
```
   
   La API estará disponible en: `http://localhost:8080`

## 📚 Documentación de API

### Usuarios
- `GET /api/usuarios` - Listar todos
- `POST /api/usuarios` - Crear usuario
- `GET /api/usuarios/{id}` - Obtener por ID
- `PUT /api/usuarios/{id}` - Actualizar
- `DELETE /api/usuarios/{id}` - Eliminar

### Categorías
- `GET /api/categorias` - Listar todas
- `POST /api/categorias` - Crear categoría
- `GET /api/categorias/{id}` - Obtener por ID
- `PUT /api/categorias/{id}` - Actualizar
- `DELETE /api/categorias/{id}` - Eliminar

### Servicios
- `GET /api/servicios` - Listar todos
- `GET /api/servicios/activos` - Listar activos
- `POST /api/servicios` - Crear servicio
- `GET /api/servicios/{id}` - Obtener por ID
- `GET /api/servicios/categoria/{categoriaId}` - Por categoría
- `GET /api/servicios/buscar?nombre=xxx` - Buscar por nombre
- `PUT /api/servicios/{id}` - Actualizar
- `PATCH /api/servicios/{id}/estado?estado=ACTIVO` - Cambiar estado
- `DELETE /api/servicios/{id}` - Eliminar

### Solicitudes
- `GET /api/solicitudes` - Listar todas
- `POST /api/solicitudes` - Crear solicitud
- `GET /api/solicitudes/{id}` - Obtener por ID
- `GET /api/solicitudes/usuario/{usuarioId}` - Por usuario
- `GET /api/solicitudes/estado/{estado}` - Por estado
- `PATCH /api/solicitudes/{id}/aprobar` - Aprobar
- `PATCH /api/solicitudes/{id}/rechazar` - Rechazar
- `DELETE /api/solicitudes/{id}` - Eliminar

## 🗂️ Estructura del Proyecto
```
src/main/java/com/unmsm/catalogo_servicios/
├── controller/       # Endpoints REST
├── service/          # Lógica de negocio
├── repository/       # Acceso a datos
├── model/            # Entidades JPA
│   └── enums/        # Enumeraciones
└── exception/        # Manejo de errores
```