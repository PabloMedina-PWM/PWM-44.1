import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecintoService } from '../recinto.service';
import { ArtistaService } from '../artista.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';

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

export class CrudComponent implements OnInit {

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recintoService: RecintoService,
    private firestore: Firestore,
    private artistaService: ArtistaService
  ) {}

  ngOnInit() {
    const currentPath = this.router.url;

    if (currentPath.includes('crud_tarea')) {
      this.mostrarCamposPorNombre(['ntarea', 'nombre', 'direccion', 'grupotexto', 'gruposelect', 'fecha', 'botones']);
      this.crudTitle = 'Tarea';
      this.thirdTextTitle = 'Descripción';
      this.placeholderThirdTextTitle = 'Descripción de la tarea';
      this.fourTextTitle = 'Prioridad';
      this.placeholderFourTextTitle = 'Prioridad';
      this.secondSelectTextTitle = 'Empleado';
      this.selectedFromSecondSelector = 'Buscar empleado';

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
            console.log('Datos recibidos:', recinto);
            this.nombre = recinto['nombre'] || '';
            this.direccion = recinto['direccion']?.nombre || '';
            this.provincia = recinto['direccion']?.provincia || '';
            this.email = recinto['contacto'] || '';
            this.capacidad = recinto['capacidad'] || '';
          } else {
            console.error('No se encontró el recinto con ID:', id);
          }
        }).catch((err) => {
          console.error('Error al obtener recinto:', err);
        });
      }


    } else if (currentPath.includes('crud_evento')) {
      this.mostrarCamposPorNombre(['nombre', 'email', 'provincia', 'grupoSelect', 'fecha', 'botones']);
      this.crudTitle = 'Evento';
      this.firstSelectTextTitle = 'Tipo de evento';
      this.selectedFromFirstSelector = 'Festival/Gira/Concierto';
      this.secondSelectTextTitle = 'Recinto';
      this.selectedFromSecondSelector = 'Buscar recinto';

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
    }
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

  eliminarRecinto(): void {
    console.log('Lógica para eliminar recinto (a implementar)');
    // Aquí puedes agregar lógica real para eliminar
  }

  guardarArtista(): void {
    const data = {
      nombre: this.nombre,
      direccion: this.direccion,
      telefono: this.telefono,
      email: this.email,
      grupo: this.capacidad
    };

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

  onSubmit() {
    const currentUrl = this.router.url;

    if (currentUrl === '/crud/crud_recintos') {
      this.guardarRecinto();
    } else if (currentUrl === '/crud/crud_artistas') {
      this.guardarArtista();
    } else {
      console.warn('Ruta no reconocida:', currentUrl);
    }
  }
}
