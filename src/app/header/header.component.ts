import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userRole: string|null = "";
  authService = inject(AuthService);
  private router: Router = inject(Router);

  async ngOnInit() {
    this.userRole = await this.authService.comprobarRol();
    if ((this.router.url === "/empleados" || this.router.url === "/tareas") && this.userRole !== "Administrador"){
      this.router.navigate(['']);
    }
  }

  async ngAfterViewInit() {
    this.userRole = await this.authService.comprobarRol();
  }

  protected readonly localStorage = localStorage;


}
