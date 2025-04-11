import {Component, inject, OnInit} from '@angular/core';
import {FirestorageService} from '../firestorage.service';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentUser = {
    username: '',
    rol: 'Administrador'
  }
  authService = inject(AuthService);
}
