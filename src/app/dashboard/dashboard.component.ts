import {Component, inject, OnInit} from '@angular/core';
import {FirestoreService} from '../firestore.service';
import {catchError, Observable, of} from 'rxjs';
import {AsyncPipe} from '@angular/common';

interface Artist {
  id: string;
  name: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
