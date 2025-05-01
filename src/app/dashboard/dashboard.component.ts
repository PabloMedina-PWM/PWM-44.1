import {Component, inject, OnInit} from '@angular/core';
import {TableComponent} from '../table/table.component';
import {ButtonComponent} from '../button/button.component';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-dashboard',
  imports: [
    TableComponent,
    ButtonComponent
  ],
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userRole: string = '';
  private router: Router = inject(Router);

  constructor(protected authService: AuthService) {}

  async ngOnInit() {
    if (localStorage.getItem('user') === null) {
      this.router.navigate(['']);
    }
    this.userRole = await this.authService.comprobarRol();

    console.log('Rol del usuario en Dashboard:', this.userRole);
  }
}
