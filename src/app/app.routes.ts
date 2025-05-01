import { Routes } from '@angular/router';
import {MainComponent} from './main/main.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ContentViewerComponent} from './content-viewer/content-viewer/content-viewer.component';

export const routes: Routes = [
  {
  path: '',
  component: MainComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  { path: ':tipo', component: ContentViewerComponent },
  { path: ':tipo/:evento', component: ContentViewerComponent },
  { path: ':crud/:id', component: DashboardComponent },

];
