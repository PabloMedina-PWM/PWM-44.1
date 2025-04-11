import {Component, inject, Input, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  @Input() nombre!: string;
  authService: AuthService = inject(AuthService);
  constructor (private route: ActivatedRoute, private router:Router) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.route.snapshot.routeConfig?.path === '') {
      const emailElement = document.querySelector<HTMLInputElement>("#email");
      const passwordElement = document.querySelector<HTMLInputElement>("#password");
      if (emailElement && passwordElement) {
        const email = emailElement.value;
        const password = passwordElement.value;
        this.authService.inicioSesion(email, password).subscribe({
          next: (user) => {
            sessionStorage.setItem("userUID", JSON.stringify(user?.uid));
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

  ngOnInit() {
    if (sessionStorage.getItem("userUID")) {
      this.router.navigate(['dashboard']);
    }
  }
}
