import { Routes } from '@angular/router';
import {MainComponent} from './main/main.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ContentViewerComponent} from './content-viewer/content-viewer/content-viewer.component';
import {CrudComponent} from './crud/crud.component';
import {authGuard} from "./auth.guard"

export const routes: Routes = [
  {
  path: '',
  component: MainComponent
  },
  {
    path: 'soporte_tecnico',
    component: MainComponent,
    canActivate: [authGuard]
  },
  {
    path: 'recuperacion_correo',
    component: MainComponent,
    canActivate: [authGuard]
  },  {
    path: 'nueva_password',
    component: MainComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { path: 'personal-profile', component: CrudComponent, canActivate: [authGuard] },

  { path: 'crud/:tipo/:id', component: CrudComponent,
    canActivate: [authGuard] },
  { path: 'crud/:tipo', component: CrudComponent,
    canActivate: [authGuard] },

  { path: ':tipo/:evento', component: ContentViewerComponent,
    canActivate: [authGuard] },
  { path: ':tipo', component: ContentViewerComponent,
    canActivate: [authGuard] },
  { path: ':crud/:id', component: DashboardComponent,
    canActivate: [authGuard] },

];
