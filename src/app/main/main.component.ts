import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  standalone: true,
  styleUrls: ['./main.component.css'],
  imports: [CommonModule, RouterLink],
})
export class MainComponent implements OnInit {
  @Input() nombre!: string;
  authService: AuthService = inject(AuthService);
  userRole: string = '';
  isAdmin: boolean = false;
  userEmail: string = '';

  textSuperior: string = 'Correo electrónico';
  textInferior: string = 'Contraseña';
  placeholderEmail: string = 'Correo electrónico';
  placeholderPassword: string = 'Contraseña';
  mainButtonText: string = 'Iniciar sesión';

  isSupportPage: boolean = false;
  previousUrl: string = '';
  isNewPassword: boolean = false;
  isEmailPage: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;

        if (url.includes('soporte_tecnico')) {
          this.setupSupportPage();
        } else if (url.includes('recuperacion_correo')) {
          this.setupEmailPage();
        } else if (url.includes('nueva_password')) {
          this.setupNewPassword();
        }

        if (
          !url.includes('soporte_tecnico') &&
          !url.includes('recuperacion_correo') &&
          !url.includes('nueva_password')
        ) {
          this.previousUrl = url;
        }
      }
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    const currentPath = this.route.snapshot.routeConfig?.path;

    const emailElement = document.querySelector<HTMLInputElement>('#email');
    const passwordElement = document.querySelector<HTMLInputElement>('#password');

    if (!emailElement || !passwordElement) {
      console.error("No se encontraron los elementos con ID 'email' o 'password'");
      return;
    }

    const email = emailElement.value;
    const password = passwordElement.value;

    if (currentPath === '') {
      localStorage.clear();

      this.authService.inicioSesion(email, password).subscribe({
        next: (user) => {
          localStorage.setItem('userUID', user?.uid || '');
          localStorage.setItem('userEmail', email);
          this.router.navigate(['dashboard']);
        },
        error: (error) => {
          console.error('Email/Password Sign-In error:', error);
        },
      });
    } else if (currentPath === 'soporte_tecnico') {
      this.router.navigate([this.previousUrl || '']);
    } else if (currentPath === 'recuperacion_correo') {
      this.router.navigate(['nueva_password']);
    } else if (currentPath === 'nueva_password') {
      console.log('Nueva contraseña confirmada para:', password);
      this.router.navigate(['']);
    }
  }

  async ngOnInit() {
    const currentUrl = this.router.url;
    const isPublicPage =
      currentUrl.includes('soporte_tecnico') ||
      currentUrl.includes('recuperacion_correo') ||
      currentUrl.includes('nueva_password');

    if (!isPublicPage) {
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
        return;
      }
    }

    if (currentUrl.includes('recuperacion_correo')) {  // Aquí sin tilde
      this.setupEmailPage();
    } else if (currentUrl.includes('nueva_password')) {
      this.setupNewPassword();
    }
  }

  private setupSupportPage() {
    this.isSupportPage = true;
    console.log('isSupportPage:', this.isSupportPage);
    this.textSuperior = 'Asunto:';
    this.textInferior = 'Descripción:';
    this.placeholderEmail = 'Indique el problema que tiene';
    this.placeholderPassword = 'Breve descripción del problema';
    this.mainButtonText = 'Enviar';
  }

  private setupNewPassword() {
    this.isNewPassword = true;
    console.log('isNewPassword:', this.isNewPassword);
    this.textSuperior = 'Nueva contraseña:';
    this.textInferior = 'Confirmar contraseña:';
    this.placeholderEmail = 'Nueva contraseña';
    this.placeholderPassword = 'Confirmar contraseña';
    this.mainButtonText = 'Confirmar';
  }

  private setupEmailPage() {
    this.isEmailPage = true;
    console.log('isEmailPage:', this.isEmailPage);
    this.textSuperior = 'Correo de recuperación:';
    this.textInferior = 'Confirmar correo:';
    this.placeholderEmail = 'Introduzca el email';
    this.placeholderPassword = 'Introduzca el email de nuevo';
    this.mainButtonText = 'Enviar enlace';
  }
}
