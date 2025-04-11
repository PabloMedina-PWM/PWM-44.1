import { Routes } from '@angular/router';
import {MainComponent} from './main/main.component';
import {DashboardComponent} from './dashboard/dashboard.component';

export const routes: Routes = [
  {
  path: '',
  component: MainComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];
