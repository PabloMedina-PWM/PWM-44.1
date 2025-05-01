import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  standalone: true,
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @Input() nombre!: string;
  authService: AuthService = inject(AuthService);
  userRole: string = '';
  isAdmin: boolean = false;
  userEmail: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.route.snapshot.routeConfig?.path === '') {
      const emailElement = document.querySelector<HTMLInputElement>("#email");
      const passwordElement = document.querySelector<HTMLInputElement>("#password");
      if (emailElement && passwordElement) {
        const email = emailElement.value;
        const password = passwordElement.value;

        localStorage.clear(); // Limpiar el localStorage

        this.authService.inicioSesion(email, password).subscribe({
          next: (user) => {
            // Guardar datos nuevos en localStorage
            localStorage.setItem("userUID", user?.uid || '');
            localStorage.setItem("userEmail", email);

            this.router.navigate(['dashboard']);
          },
          error: (error) => {
            console.error('Email/Password Sign-In error:', error);
          },
        });
      } else {
        console.error("No se encontraron los elementos con ID 'email' o 'password'");
      }
    }
  }

  async ngOnInit() {
    const userUID = localStorage.getItem('userUID');
    if (!userUID) {
      this.router.navigate(['']);
      return;
    }

    this.userEmail = localStorage.getItem('userEmail') || '';

    const role = await this.authService.comprobarRol();
    this.userRole = role;
    console.log('Rol del usuario:', this.userRole);

    this.isAdmin = this.userRole === 'admin';

    if (!this.isAdmin) {
      this.router.navigate(['dashboard']);
    }
  }
}
