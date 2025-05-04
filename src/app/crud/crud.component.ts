import {AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecintoService } from '../recinto.service';
import { ArtistaService } from '../artista.service';
import { TareaService } from '../tarea.service';
import { EmpleadoService } from '../empleado.service';
import { EventoService } from '../evento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {collection, collectionData, DocumentData, Firestore} from '@angular/fire/firestore';
import Choices from 'choices.js';
import {FirestoreService} from '../firestore.service';
import {AuthService} from '../auth.service';


@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})

export class CrudComponent implements OnInit, AfterViewInit {

  // Flags para mostrar campos dinámicamente
  mostrarNTarea = false;
  mostrarNombre = false;
  mostrarDireccion = false;
  mostrarTelefono = false;
  mostrarEmail = false;
  mostrarPassword = false;
  mostrarGrupoTexto = false;
  mostrarProvincia = false;
  mostrarGrupoSelect = false;
  mostrarFecha = false;
  mostrarBotones = false;
  mostrarSelectorMultiple = false;
  mostrarCerrarSesion = false;

  // Textos dinámicos
  crudTitle: string | undefined;
  fourTextTitle: string | undefined;
  placeholderFourTextTitle: string | undefined;
  firstSelectTextTitle: string | undefined;
  selectedFromFirstSelector: string | undefined;
  secondSelectTextTitle: string | undefined;
  selectedFromSecondSelector: string | undefined;
  thirdTextTitle: string | undefined;
  placeholderThirdTextTitle: string | undefined;

  // Datos del formulario
  ntarea: string = '';
  nombre: string = '';
  direccion: string = '';
  telefono: string = '';
  email: string = '';
  password: string = '';
  capacidad: any = '';
  provincia: string = '';
  grupoSeleccionado: string = '';
  fecha: string = '';
  provinciasDisponibles: string[] = [];
  nombresEmpleados: string[] = [];
  nombresRecintos: string[] = [];
  artistasSeleccionados: string[] = [];
  choicesInstance: any;
  id:string = "";


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recintoService: RecintoService,
    private firestore: Firestore,
    private artistaService: ArtistaService,
    private tareaService: TareaService,
    private empleadoService: EmpleadoService,
    private eventoService: EventoService,
    private firestoreService: FirestoreService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const currentPath = this.router.url;

    if (currentPath.includes('crud_tareas')) {
      this.mostrarCamposPorNombre(['ntarea', 'nombre', 'direccion', 'grupotexto', 'gruposelect', 'fecha', 'botones']);
      this.crudTitle = 'Tarea';
      this.thirdTextTitle = 'Descripción';
      this.placeholderThirdTextTitle = 'Descripción de la tarea';
      this.fourTextTitle = 'Prioridad';
      this.placeholderFourTextTitle = 'Prioridad';
      this.secondSelectTextTitle = 'Empleado';
      this.selectedFromSecondSelector = 'Buscar empleado';

      this.tareaService.getNombresEmpleados().then(nombres => {
        this.nombresEmpleados = nombres;
        console.log(this.nombresEmpleados);
      }).catch(err => console.error('Error al cargar empleados:', err));

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.tareaService.getTareaById(id).then((docSnap) => {
          if (docSnap.exists()) {
            const tarea = docSnap.data();
            this.ntarea = tarea['idTarea'] || '';
            this.nombre = tarea['nombre'] || '';
            this.direccion = tarea['descripcion'] || '';
            this.capacidad = tarea['prioridad'] || '';
            this.fecha = tarea['fecha'] || '';
            this.grupoSeleccionado = tarea['empleado'] || '';
            this.id = tarea['id'];
          } else {
            console.error('No se encontró la tarea con ID:', id);
          }
        }).catch((err) => {
          console.error('Error al obtener la tarea:', err);
        });
      }

    } else if (currentPath.includes('crud_recintos')) {
      this.mostrarCamposPorNombre(['nombre', 'direccion', 'email', 'grupotexto', 'provincia', 'botones']);
      this.crudTitle = 'Recinto';
      this.thirdTextTitle = 'Dirección';
      this.placeholderThirdTextTitle = 'Dirección del recinto';
      this.fourTextTitle = 'Capacidad';
      this.placeholderFourTextTitle = 'Selecciona la capacidad';
      this.firstSelectTextTitle = 'Provincia';
      this.selectedFromFirstSelector = 'Buscar provincia';

      this.recintoService.getProvincias().then((provincias) => {
        this.provinciasDisponibles = provincias;
      });

      const id = this.route.snapshot.paramMap.get('id');
      console.log('ID recibido:', id);

      if (id) {
        this.recintoService.getRecintoById(id).then((docSnap) => {
          if (docSnap.exists()) {
            const recinto = docSnap.data();
            this.nombre = recinto['nombre'] || '';
            this.direccion = recinto['direccion']?.nombre || '';
            this.provincia = recinto['direccion']?.provincia || '';
            this.email = recinto['contacto'] || '';
            this.capacidad = recinto['capacidad'] || '';
            this.grupoSeleccionado = recinto['recinto'];
            this.id = recinto['id'];
          } else {
            console.error('No se encontró el recinto con ID:', id);
          }
        }).catch((err) => {
          console.error('Error al obtener recinto:', err);
        });
      }
    } else if (currentPath.includes('crud_evento')) {
      this.mostrarCamposPorNombre(['nombre', 'email', 'grupotexto', 'grupoSelect', 'fecha', 'c-new-selector', 'botones']);
      this.crudTitle = 'Evento';
      this.fourTextTitle = 'Tipo de evento';
      this.placeholderFourTextTitle = 'Tipo';
      this.secondSelectTextTitle = 'Recinto';
      this.selectedFromSecondSelector = 'Buscar recinto';

      this.eventoService.getNombresRecintos().then(nombres => {
        this.nombresRecintos = nombres;
      }).catch(err => console.error('Error al cargar empleados:', err));

      this.cargarArtistas();

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.eventoService.getEventoById(id).then((docSnap) => {
          if (docSnap.exists()) {
            const evento = docSnap.data();
            this.nombre = evento['nombre'] || '';
            this.email = evento['contacto'] || '';
            this.fecha = evento['fecha'] || '';
            this.capacidad = evento['tipo'] || '';
            this.grupoSeleccionado = evento['recinto'].nombre || '';
            this.artistasSeleccionados = evento['artistas'] || [];
            this.id = evento['id'];

          } else {
            console.error('No se encontró el evento con ID:', id);
          }
        }).catch((err) => {
          console.error('Error al obtener el evento:', err);
        });
      }

    } else if (currentPath.includes('crud_artista')) {
      this.mostrarCamposPorNombre(['nombre', 'direccion', 'telefono', 'email', 'grupoTexto', 'botones']);
      this.crudTitle = 'Artista';
      this.thirdTextTitle = 'Dirección';
      this.placeholderThirdTextTitle = 'Procedencia del artista';
      this.fourTextTitle = 'Grupo';
      this.placeholderFourTextTitle = 'Nombre del grupo';

      const id = this.route.snapshot.paramMap.get('id');
      console.log('ID recibido:', id);

      if (id) {
        this.artistaService.getArtistaById(id).then((docSnap) => {
          if (docSnap.exists()) {
            const artista = docSnap.data();
            console.log('Datos recibidos:', artista);
            this.nombre = artista['nombre'] || '';
            this.direccion = artista['dirección'] || '';
            this.email = artista['email'] || '';
            this.telefono = artista['teléfono'] || '';
            this.capacidad = artista['grupo'] || '';
            this.id = artista['id'];
          } else {
            console.error('No se encontró el recinto con ID:', id);
          }
        }).catch((err) => {
          console.error('Error al obtener recinto:', err);
        });
      }

    } else if (currentPath.includes('crud_empleado')) {
      this.mostrarCamposPorNombre(['nombre', 'direccion', 'telefono', 'email', 'password', 'grupoTexto', 'botones']);
      this.crudTitle = 'Empleado';
      this.thirdTextTitle = 'Apellidos';
      this.placeholderThirdTextTitle = 'Apellidos';
      this.fourTextTitle = 'Rol';
      this.placeholderFourTextTitle = 'Rol';

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.empleadoService.getEmpleadoById(id).then((docSnap) => {
          if (docSnap.exists()) {
            const empleado = docSnap.data();
            this.nombre = empleado['nombre'] || '';
            this.direccion = empleado['apellidos'] || '';
            this.telefono = empleado['teléfono'] || '';
            this.email = empleado['correo electrónico'] || '';
            this.capacidad = empleado['rol'] || '';
            this.password = empleado['contraseña'] || '';
            this.id = empleado['id'];
          } else {
            console.error('No se encontró la tarea con ID:', id);
          }
        }).catch((err) => {
          console.error('Error al obtener la tarea:', err);
        });
      }

    } else if (currentPath.includes("personal-profile")) {
      this.mostrarCamposPorNombre(['nombre', 'direccion', 'telefono', 'email', 'password', 'grupoTexto', 'botones']);
      this.crudTitle = 'Empleado';
      this.thirdTextTitle = 'Apellidos';
      this.placeholderThirdTextTitle = 'Apellidos';
      this.fourTextTitle = 'Rol';
      this.placeholderFourTextTitle = 'Rol';
      this.mostrarCerrarSesion = true;

      const email: string | null = JSON.parse(<string>localStorage.getItem("user")).email;
      if (email) {
        this.empleadoService.getEmpleadoByEmail(email).then(empleado => {
          if (empleado) {
            this.nombre = empleado['nombre'] || '';
            this.direccion = empleado['apellidos'] || '';
            this.telefono = empleado['teléfono'] || '';
            this.email = empleado['correo electrónico'] || '';
            this.capacidad = empleado['rol'] || '';
            this.password = empleado['contraseña'] || '';
            this.id = empleado['id'];
          } else {
            console.error('No se encontró la tarea con ID:', email);
          }
        }).catch((err) => {
          console.error('Error al obtener la tarea:', err);
        });
      }
    }


  }

  ngAfterViewInit(): void {

    this.choicesInstance = new Choices('#new-select', {
      removeItemButton: true,
      placeholder: true,
      placeholderValue: 'Selecciona artistas',
      noResultsText: 'No hay coincidencias',
      noChoicesText: 'No hay artistas disponibles'
    });
  }

  cargarArtistas(): void {
    const artistasRef = collection(this.firestore, 'artistas');
    collectionData(artistasRef, { idField: 'id' }).subscribe((artistas: any[]) => {
      const opciones = artistas.map(a => ({ value: a.nombre, label: a.nombre }));

      if (this.choicesInstance) {
        this.choicesInstance.setChoices(opciones, 'value', 'label', true);
      }
    });
  }


  mostrarCamposPorNombre(campos: string[]) {
    campos.forEach((campo) => {
      switch (campo.toLowerCase()) {
        case 'ntarea': this.mostrarNTarea = true; break;
        case 'nombre': this.mostrarNombre = true; break;
        case 'direccion': this.mostrarDireccion = true; break;
        case 'telefono': this.mostrarTelefono = true; break;
        case 'email': this.mostrarEmail = true; break;
        case 'password': this.mostrarPassword = true; break;
        case 'grupotexto': this.mostrarGrupoTexto = true; break;
        case 'provincia': this.mostrarProvincia = true; break;
        case 'gruposelect': this.mostrarGrupoSelect = true; break;
        case 'fecha': this.mostrarFecha = true; break;
        case 'botones': this.mostrarBotones = true; break;
        case 'c-new-selector': this.mostrarSelectorMultiple = true; break;
      }
    });
  }

  guardarRecinto(): void {
    const data = {
      nombre: this.nombre,
      direccion: {
        nombre: this.direccion,
        provincia: this.provincia
      },
      contacto: this.email,
      capacidad: this.capacidad
    };

    if (this.route.snapshot.paramMap.get("id")) {
      const id: string = <string>this.route.snapshot.paramMap.get("id");
      const data2 = {
        nombre: this.nombre,
        direccion: {
          nombre: this.direccion,
          provincia: this.provincia
        },
        contacto: this.email,
        capacidad: this.capacidad,
        id: id
      }
      this.firestoreService.updateDocument("recintos", data2);
      return;
    }

    this.recintoService.addRecinto(data)
      .then((docRef) => {
        const id = docRef.id;
        return this.recintoService.updateRecintoId(id);
      })
      .then(() => {
        console.log('Recinto agregado con dirección anidada e ID');
        this.router.navigate(['/crud_recintos']);
      })
      .catch(err => console.error('Error al agregar:', err));
  }

  eliminarDocumento(): void {
    if (this.crudTitle && this.route.snapshot.paramMap.get("id")) {
      const id:string = <string>this.route.snapshot.paramMap.get("id")?.toString();
      let titulo = this.crudTitle.toLowerCase();
      if (this.crudTitle.charAt(-1) !== "s") {
        if (titulo !== "empleado") {
          titulo = titulo + "s";
        }
      }
      this.firestoreService.deleteDocument(titulo, id);
      if (titulo === "empleado") {
        titulo = "empleados";
      }
      this.router.navigate(['/'+titulo]);
      alert("Eliminado correctamente");
    }
  }

  guardarArtista(): void {
    const data = {
      nombre: this.nombre,
      direccion: this.direccion,
      telefono: this.telefono,
      email: this.email,
      grupo: this.capacidad
    };

    if (this.route.snapshot.paramMap.get("id")) {
      const id: string = <string>this.route.snapshot.paramMap.get("id");
      const data2 = {
        nombre: this.nombre,
        direccion: this.direccion,
        teléfono: this.telefono,
        email: this.email,
        grupo: this.capacidad,
        id: id
      }
      this.firestoreService.updateDocument("artistas", data2);
      return;
    }

    this.artistaService.addArtista(data)
      .then((docRef) => {
        const id = docRef.id;
        return this.artistaService.updateArtistaId(id);
      })
      .then(() => {
        console.log('Artista agregado con ID');
        this.router.navigate(['/crud_artistas']);
      })
      .catch(err => console.error('Error al agregar artista:', err));
  }

  guardarTarea(): void {
    const data = {
      nombre: this.nombre,
      descripcion: this.direccion,
      prioridad: this.capacidad,
      idTarea: this.ntarea,
      fecha: this.fecha,
      empleado: this.grupoSeleccionado
    };

    if (this.route.snapshot.paramMap.get("id")) {
      const id: string = <string>this.route.snapshot.paramMap.get("id");
      const data2 = {
        nombre: this.nombre,
        descripcion: this.direccion,
        prioridad: this.capacidad,
        idTarea: this.ntarea,
        fecha: this.fecha,
        empleado: this.grupoSeleccionado,
        id: id
      }
      this.firestoreService.updateDocument("tareas", data2);
      return;
    }

    this.tareaService.addTarea(data)
      .then((docRef) => {
        const id = docRef.id;
        return this.tareaService.updateTareaId(id);
      })
      .then(() => {
        console.log('Recinto agregado con dirección anidada e ID');
        this.router.navigate(['/crud_tareas']);
      })
      .catch(err => console.error('Error al agregar:', err));
  }

  guardarEmpleado(): void {
    const data = {
      nombre: this.nombre,
      apellidos: this.direccion,
      teléfono: this.telefono,
      "correo electrónico": this.email,
      rol: this.capacidad,
      contraseña: this.password
    };

    if (this.route.snapshot.paramMap.get("id")) {
      const id: string = <string>this.route.snapshot.paramMap.get("id");
      const data2 = {
        nombre: this.nombre,
        apellidos: this.direccion,
        teléfono: this.telefono,
        "correo electrónico": this.email,
        rol: this.capacidad,
        contraseña: this.password,
        id: id
      }
      this.firestoreService.updateDocument("empleados", data2);
      return;
    }

    this.empleadoService.addEmpleado(data)
      .then((docRef) => {
        const id = docRef.id;
        return this.empleadoService.updateEmpleadoId(id);
      })
      .then(() => {
        console.log('Recinto agregado con dirección anidada e ID');
        this.router.navigate(['/crud_empleados']);
      })
      .catch(err => console.error('Error al agregar:', err));
  }

  guardarEvento(): void {
    this.artistasSeleccionados = this.choicesInstance.getValue(true); // obtiene solo los valores seleccionados (nombres)

    const data = {
      nombre: this.nombre,
      contacto: this.email,
      fecha: this.fecha,
      tipo: this.capacidad,
      recinto: this.grupoSeleccionado,
      artistas: this.artistasSeleccionados
    };

    if (this.route.snapshot.paramMap.get("id")) {
      const id: string = <string>this.route.snapshot.paramMap.get("id");
      const data2 = {
        nombre: this.nombre,
        contacto: this.email,
        fecha: this.fecha,
        tipo: this.capacidad,
        recinto: this.grupoSeleccionado,
        artistas: this.artistasSeleccionados,
        id: id
      }
      this.firestoreService.updateDocument("eventos", data2);
      return;
    }

    this.eventoService.addEvento(data)
      .then((docRef) => {
        const id = docRef.id;
        return this.eventoService.updateEventoId(id);
      })
      .then(() => {
        console.log('Evento agregado con artistas seleccionados');
        this.router.navigate(['/crud_eventos']);
      })
      .catch(err => console.error('Error al agregar evento:', err));
  }


  onSubmit() {
    const currentUrl = this.router.url;

    if (currentUrl.includes('/crud/crud_recintos')) {
      this.guardarRecinto();
    } else if (currentUrl.includes('/crud/crud_artistas')) {
      this.guardarArtista();
    }else if(currentUrl.includes('/crud/crud_tareas')) {
      this.guardarTarea();
    } else if(currentUrl.includes('/crud/crud_empleados')) {
      this.guardarEmpleado();
    } else if(currentUrl.includes('/crud/crud_eventos')) {
      this.guardarEvento();
    }
    else {
      console.warn('Ruta no reconocida:', currentUrl);
    }
  }

  logOut() {
    this.authService.cerrarSesion();
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
