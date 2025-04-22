import {Component, OnInit} from '@angular/core';
import {TableComponent} from '../table/table.component';
import {ButtonComponent} from '../button/button.component';
import {AuthService} from '../auth.service';


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

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.userRole = await this.authService.comprobarRol();

    console.log('Rol del usuario en Dashboard:', this.userRole);
  }
}
