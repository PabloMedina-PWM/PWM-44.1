import {Component, Input} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    standalone: true,
    styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  constructor(private authService: AuthService, private router: Router) { }
  @Input() mostrarRecinto: boolean = false;
  @Input() mostrarTarea: boolean = false;
  @Input() mostrarEmpleado: boolean = false;
  @Input() mostrarArtista: boolean = false;
  @Input() mostrarEventos: boolean = false;
  buttontext: string = "";


  cerrarSesion(): void {
    this.authService.cerrarSesion().subscribe({
      next: () => {
        console.log('Sesión cerrada');
        // Redirigir a la página principal después de cerrar sesión
        this.router.navigate(['']);  // Usa la ruta vacía para ir a la página principal
      },
      error: (error) => {
        console.error('Error cerrando sesión:', error);
      }
    });
  }
  async ngOnInit() {
    if (this.mostrarTarea) {
        this.buttontext = "Añadir tarea"
    }
    if (this.mostrarRecinto) {
      this.buttontext = "Añadir recinto"
    }
    if (this.mostrarEmpleado) {
      this.buttontext = "Añadir empleado"
    }
    if (this.mostrarArtista) {
      this.buttontext = "Añadir artista"
    }
    if (this.mostrarEventos) {
      this.buttontext = "Añadir evento"
    }
  }

  handleButtonClick() {
    if (this.mostrarTarea) {
      this.router.navigate(["/crud_tareas",], {state: {
        page: "tareas"
        }});
    }
    if (this.mostrarRecinto) {
      this.router.navigate(["/crud_recintos",], {state: {
          page: "recintos"
        }});
    }
    if (this.mostrarEmpleado) {
      this.router.navigate(["/crud_empleados",], {state: {
          page: "empleado"
        }});
    }
    if (this.mostrarArtista) {
      this.router.navigate(["/crud_artistas",], {state: {
          page: "artistas"
        }});
    }
    if (this.mostrarEventos) {
      this.router.navigate(["/crud_eventos",], {state: {
          page: "eventos"
        }});
    }
    /*if (this.buttontext === 'Añadir artista') {
      this.cerrarSesion();
    }
    else {
      console.log('Botón clickeado, pero no es "Añadir artista".');
    }*/
  }
}
