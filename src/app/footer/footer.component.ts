import {Component, inject} from '@angular/core';
import {AuthService} from '../auth.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
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
