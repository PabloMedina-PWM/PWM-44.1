import { Routes } from '@angular/router';
import {MainComponent} from './main/main.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ContentViewerComponent} from './content-viewer/content-viewer/content-viewer.component';
import {CrudComponent} from './crud/crud.component';

export const routes: Routes = [
  {
  path: '',
  component: MainComponent
  },
  {
    path: 'soporte_tecnico',
    component: MainComponent
  },
  {
    path: 'recuperacion_correo',
    component: MainComponent
  },  {
    path: 'nueva_password',
    component: MainComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  { path: 'crud/:tipo/:id', component: CrudComponent },
  { path: ':tipo', component: ContentViewerComponent },
  { path: ':tipo/:evento', component: ContentViewerComponent },
  { path: ':crud/:id', component: DashboardComponent },



];
