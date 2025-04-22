import { Component, Input, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() mostrarTareas: boolean = false;
  @Input() mostrarEventos: boolean = false;

  tareas: any[] = [];
  eventos: any[] = [];

  @ViewChild('tituloRef') tituloRef!: ElementRef;
  @ViewChild('theadRef') theadRef!: ElementRef;
  @ViewChild('tbodyRef') tbodyRef!: ElementRef;

  constructor(private firestore: Firestore, private zone: NgZone) {}

  async ngOnInit() {
    if (this.mostrarTareas) {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;

      const tareasRef = collection(this.firestore, 'tareas');
      const q = query(tareasRef, where('emailEmpleado', '==', userEmail));

      this.zone.run(async () => {
        const querySnapshot = await getDocs(q);
        this.tareas = querySnapshot.docs.map(doc => doc.data());
      });
    }

    if (this.mostrarEventos) {
      const eventosRef = collection(this.firestore, 'eventos');
      this.zone.run(async () => {
        const querySnapshot = await getDocs(eventosRef);
        const eventos = querySnapshot.docs.map(doc => doc.data());

        setTimeout(() => {
          if (this.tituloRef) this.tituloRef.nativeElement.innerText = 'Próximos eventos';

          if (this.theadRef) {
            this.theadRef.nativeElement.innerHTML = `
              <th>Nombre</th>
              <th>Recinto</th>
              <th>Fecha</th>
            `;
          }

          if (this.tbodyRef) {
            this.tbodyRef.nativeElement.innerHTML = '';

            eventos.forEach(evento => {
              const row = document.createElement('tr');
              row.innerHTML = `
              <td>${evento['nombre']}</td>
              <td>${evento['recinto']?.['nombre']}</td>
              <td>${evento['fecha']}</td>
              `;
              this.tbodyRef.nativeElement.appendChild(row);
            });
          }
        }, 0);
      });
    }
  }
}
