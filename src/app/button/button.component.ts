import {Component, Input} from '@angular/core';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: true,
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }
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
    let tipo = "";

    if (this.mostrarTarea) tipo = "crud_tareas";
    else if (this.mostrarRecinto) tipo = "crud_recintos";
    else if (this.mostrarEmpleado) tipo = "crud_empleados";
    else if (this.mostrarArtista) tipo = "crud_artistas";
    else if (this.mostrarEventos) tipo = "crud_eventos";

    if (tipo) {
      this.router.navigate([`/crud/${tipo}`], { state: { page: tipo } });
    }
    /*if (this.buttontext === 'Añadir artista') {
      this.cerrarSesion();
    }
    else {
      console.log('Botón clickeado, pero no es "Añadir artista".');
    }*/
  }
}
