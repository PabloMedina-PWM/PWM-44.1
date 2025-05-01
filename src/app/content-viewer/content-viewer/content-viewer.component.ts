import {Component, inject, Input} from '@angular/core';
import {
  ContentViewerTableComponent
} from '../../content-viewer-table/content-viewer-table/content-viewer-table.component';
import { FirestoreService } from '../../firestore.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-content-viewer',
  imports: [
    ContentViewerTableComponent,
    FormsModule
  ],
  templateUrl: './content-viewer.component.html',
  styleUrl: './content-viewer.component.css'
})
export class ContentViewerComponent {
  firestoreService: FirestoreService = inject(FirestoreService);
  collection: any[] = [];
  titulo: string = "";
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  allowedPages: string[] = ["eventos", "empleados", "tareas", "artistas", "recintos"];
  private router: Router = inject(Router);
  private originalCollection: any[] = [];
  private appliedFilters: { [key: string]: string } = {};
  filters: string[] = [];
  searchText: string = "";
  capacidadMax: any;
  page: string = "";

  ngOnInit() {
    if (localStorage.getItem('user') === null) {
      this.router.navigate(['']);
    }
    this.activatedRoute.params.subscribe(params => {
      this.page = params["tipo"];
      if (this.page != null) {
        if (!this.allowedPages.includes(this.page)) {
          this.router.navigate(['/dashboard']);
        }
        this.titulo = this.page.charAt(0).toUpperCase() + this.page.slice(1).toLowerCase();
        if (this.page === "empleados") {
          this.page = "empleado";
        }
        this.firestoreService.getCollection(this.page).subscribe({
          next: data => {
            this.originalCollection = data;
            this.collection = data;
          }
        });
        switch (this.page) {
          case 'empleado':
            this.filters = ["Rol"];
            break;
          case 'tareas':
            this.filters = ["Prioridad", "Empleado"];
            break;
          case 'artistas':
            this.filters = ["Grupo", "Eventos"];
            if (this.activatedRoute.snapshot.paramMap.get('evento')) {
              this.appliedFilters["Evento"] = <string>this.activatedRoute.snapshot.paramMap.get('evento');
            }
            break;
          case 'eventos':
            this.filters = ["Recinto", "Provincia"];
            break;
          case 'recintos':
            this.filters = ["Provincia"];
            break;
        }

      }
    });

  }

  getFilters(filter: string): string[] {
    const resultSet = new Set<string>();

    for (let row of this.originalCollection) {
      if (filter === "Provincia" && this.router.url === "/eventos") {
        const fieldValue = row["recinto"]?.provincia;
        if (fieldValue) {
          resultSet.add(fieldValue);
        }
      } else if (filter === "Recinto") {
        const fieldValue = row["recinto"]?.nombre;
        if (fieldValue) {
          resultSet.add(fieldValue);
        }
      } else if (filter === "Provincia" && this.router.url === "/recintos") {
        const fieldValue = row["direccion"]?.provincia;
        if (fieldValue) {
          resultSet.add(fieldValue);
        }
      } else {
        const fieldValue = row[filter.toLowerCase()];
        if (fieldValue) {
          if (Array.isArray(fieldValue)) {
            for (let item of fieldValue) {
              resultSet.add(item);
            }
          } else {
            resultSet.add(fieldValue);
          }
        }
      }
    }

    return Array.from(resultSet);
  }


  filterTable(event: Event, filter: string) {
    let select = (event.target as HTMLSelectElement);

    if (select.value === "Eliminar filtro") {
      delete this.appliedFilters[filter];
      select.value = filter;
    } else {
      this.appliedFilters[filter] = select.value;
    }

    this.applyFilters();
  }
    applyFilters() {
      this.collection = this.originalCollection.filter(row =>
        Object.entries(this.appliedFilters).every(([key, filterValue]) => {
          let cellValue: any;
          if (key.toLowerCase() === 'provincia' && this.router.url === "/eventos") {
            cellValue = row['recinto'];
          } else if (key.toLowerCase() === 'provincia' && this.router.url === "/recintos") {
            cellValue = row['direccion'];
          } else {
            cellValue = row[key.toLowerCase()];
          }

          if (Array.isArray(cellValue)) {
            return cellValue.some(item => {
              if (item && typeof item === 'object' && 'provincia' in item && key.toLowerCase() === 'provincia') {
                return item.provincia === filterValue;
              } else if (item && typeof item === 'object' && 'provincia' in item && key.toLowerCase() === "recinto") {
                return item.nombre === filterValue;
              }
              return item === filterValue;
            });
          } else if (cellValue && typeof cellValue === 'object' && 'provincia' in cellValue && key.toLowerCase() === 'provincia') {
            return cellValue.provincia === filterValue;
          } else if (cellValue && typeof cellValue === 'object' && 'provincia' in cellValue && key.toLowerCase() === 'recinto')  {
            return cellValue.nombre === filterValue;
          }
          else {
            return cellValue === filterValue;
          }
        })
      );
  }



  goTo() {
    this.router.navigate(['/'+this.titulo.toLowerCase().slice(0,-1)]);
  }
}
