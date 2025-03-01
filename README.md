# ProdAndFests - Gestión interna de eventos culturales.

## Integrantes del grupo
- Suliman Hassan El Boutaybi  
- Kevin José Falcón Armas  
- Pablo Medina Quintana  

## Descripción del proyecto
Página web enfocada a la gestión interna de eventos culturales.
Permite la creación, edición y eliminación de Recintos, Artistas, Eventos y Tareas,
con el principal objetivo de visualizar los detalles a simple vista, y gestionar
de manera eficiente próximos eventos y planificar aquellos que aún no se han iniciado.


## Listado de requisitos funcionales
### 1. Autenticación y gestión de usuarios
- Autenticación de usuarios. 
- Recuperación y cambio de contraseña. 
- Gestión de perfiles (visualización y edición de datos personales). 
- Existencia de roles de usuario, con permisos diferentes en cada caso. 
- Edición de cuentas de empleado por parte del personal administrador.

### 2. Navegación e interfaz principal
- Dashboard que ofrezca una visión general de la información relevante, tareas, próximos eventos y capacidad de acceder a la creación y edición de eventos, artistas, recintos, e incluso tareas y empleados en el caso del personal administrador. 
- Menú de navegación intuitivo que permita acceder a las distintas secciones del sistema.

### 3. Gestión de contenidos o datos
- Creación, edición y eliminación de elementos (recintos, artistas, eventos, tareas y empleados). 
- Visualización de listados y detalles de los elementos registrados. 
- Implementación de filtros, búsqueda y ordenamiento para facilitar la localización de información.

### 4. Interacción y comunicación
- Sistema de notificaciones y alertas para informar al usuario sobre eventos importantes (mensajes, actualizaciones o recordatorios de próximos eventos y tareas).
- Formularios de contacto para soporte técnico, en caso de existir alguna incidencia por parte del empleado.  

## Mockups y Storyboard
- **Archivo PDF:** [Ubicación del archivo PDF con los mockups y storyboard](https://github.com/PabloMedina-PWM/PWM-44.1/blob/master/PWM-MOCKUPS-STORYBOARD-GRUPO-44.1.pdf)

## Listado de archivos templates y archivos en los que se cargan
- main.html
  - index.html
  - correo_recuperacion.html
  - restablecer_contrasena.html
  - soporte_tecnico.html
- content-viewer.html 
  - artistas.html
  - empleados.html
  - recintos.html
  - eventos.html
  - tareas.html
- crud.html
  - crud_artista.html
  - crud_empleado.html
  - crud_evento.html
  - crud_recinto.html
  - crud_tarea.html
  - cuenta_usuario.html
- dashboard.html
  - dashboard.html
- footer.html
  - Todas las páginas html
- header.html
  - Todas las páginas html


## Páginas HTML del proyecto y el mockup que implementa
- index.html
  - Login
- correo_recuperacion.html 
  - Recuperar contraseña
- restablecer_contrasena.html
  - Cambio de contraseña
- soporte_tecnico.html
  - Soporte técnico
- artistas.html
  - Artistas
- empleados.html
  - Empleados
- recintos.html
  - Recintos
- eventos.html
  - Eventos
- tareas.html
  - Tareas
- crud_artista.html
  - Añadir/Editar Artista
- crud_empleado.html
  - Añadir/Editar Empleado
- crud_evento.html
  - Añadir/Editar Evento
- crud_recinto.html
  - Añadir/Editar Recinto
- crud_tarea.html
  - Añadir/Editar Tarea
- cuenta_usuario.html
  - Cuenta de Empleado
- dashboard.html
  - Dashboard

### Página de inicio de la aplicación
- index.html (Inicio de sesión, tras esta, irá a dashboard)

## Enlaces útiles
- **Figma:** [Diseño en Figma](https://www.figma.com/design/O6NHH5X5xD8LPR7eL7aZba/PWM-Grupo-44.1?node-id=0-1&p=f&t=SiV9k2jwRxkNNQqw-0)  
- **Trello:** [Tablero en Trello](https://trello.com/b/wFDWguWA/pwm-441)  
