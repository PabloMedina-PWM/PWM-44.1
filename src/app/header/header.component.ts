import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentUser = {
    username: "Hola",
    rol: "Administrador"
  }
  authService = inject(AuthService);
}
