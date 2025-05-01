import {Component, inject, OnInit} from '@angular/core';
import {FirestorageService} from '../firestorage.service';
import {AuthService} from '../auth.service';
import {parseJson} from '@angular/cli/src/utilities/json-file';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentUser = {
    username: '',
    rol: 'Administrador'
  }
  authService = inject(AuthService);
    protected readonly localStorage = localStorage;
  protected userRole: string = "";

  async ngOnInit() {
    this.userRole = await this.authService.comprobarRol();
  }
}
