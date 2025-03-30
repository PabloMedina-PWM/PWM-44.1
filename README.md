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

## IMPORTANTE: EJECUTAR NPM INSTALL AL ABRIR EL PROYECTO, AUTOMÁTICAMENTE INSTALARÁ JSON SERVER Y LO INICIARÁ

## Detalles importantes para el SPRINT 2

Puede abrirse cualquiera de las páginas de la carpeta code/html, pues todas redirigen a index.html en caso de no haber iniciado sesión.
La sesión se cierra en el apartado de cuenta de usuario, accesible picando en la imagen de usuario presente en el header.

En este SPRINT se han añadido las siguientes funcionalidades:
- **Login:** distingue entre usuarios administradores (tendrán acceso a las páginas de empleados y tareas) y usuarios no administradores. 
  - Cuentas de usuario:
    - Administrador: ana@prodandfests.com
    - No administrador: marcos@prodandfests.com
    - Contraseña de todas las cuentas: prueba1234-
- **Dashboard:** muestra las tareas asignadas al usuario que ha iniciado sesión. Ademas, muestra los eventos próximos (aquellos que se celebrarán durante el próximo mes). Estos datos son extraídos del JSON.
- **Muestra de datos:** todos los datos del JSON pueden consultarse desde las diferentes páginas (eventos, artistas, tareas, recintos y empleados), permitiendo ver, filtrar por diversos campos y además buscar.

  El filtro de fecha de las diferentes páginas funciona como fecha límite, es decir, se mostrarán todas aquellas filas que tengan una fecha anterior o igual a la seleccionada. Queda pendiente hacerlo con un rango de fechas en el próximo sprint.
- **CRUD:** ahora, la web permite la creación, edición y eliminación de eventos, artistas, recintos, tareas y empleados, estos dos últimos sólo en caso de ser usuario administrador.
- **JSON:** las creaciones, ediciones y eliminaciones previamente mencionadas se reflejan directamente en el db.json gracias al uso de json-server.

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

## Mockups, storyboard y templates
- **Archivo PDF:** [Mockups y storyboard actualizados SPRINT 2](https://drive.google.com/file/d/1Zy-JhGAwfZIy27lgdeHjK-SEcU28VHKo/view?usp=sharing)
- **Archivo PDF:** [Templates](https://drive.google.com/file/d/1fF63HOjzUm8UOH_ISxyiZX9-TdlreM8n/view?usp=drive_link)


(También pueden encontrarse en la carpeta /pdfs de este mismo repositorio.)

## Presentación y vídeo
- **Archivo PDF:** [Presentación](https://drive.google.com/file/d/1dNxQBhGbq_D47FEYHuwpF0ThRdCUfiMQ/view?usp=sharing)
- **Vídeo MP4:** [Vídeo](https://drive.google.com/file/d/1655nbYBS4x_qw2IuD5TyXoYkigKoo-kN/view?usp=sharing)

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
- index.html (Inicio de sesión, tras autenticarse, irá a dashboard)

## Enlaces útiles
- **Figma:** [Diseño en Figma](https://www.figma.com/design/O6NHH5X5xD8LPR7eL7aZba/PWM-Grupo-44.1?node-id=0-1&p=f&t=SiV9k2jwRxkNNQqw-0)  
- **Trello:** [Tablero en Trello](https://trello.com/b/wFDWguWA/pwm-441)  
