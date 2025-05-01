import {Component, inject, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-content-viewer-table',
  imports: [],
  templateUrl: './content-viewer-table.component.html',
  styleUrl: './content-viewer-table.component.css'
})
export class ContentViewerTableComponent {
    headings: string[] = [];
    @Input() rows!: any[];
    button: string = "";
    router: Router = inject(Router);
    fields: string[] = [];
    sortField: string = "";
    buttonField: string = "";
    @Input() filterText!: string;
    @Input() capacidadMax!: number;
    activatedRoute: ActivatedRoute = inject(ActivatedRoute);

    ngOnInit() {
      this.activatedRoute.params.subscribe(params => {
        switch (params["tipo"]) {
          case 'empleados':
            this.headings = ["Nombre", "Correo Electrónico", "Rol", "Tareas"];
            this.fields = ["nombre", "correo electrónico", "rol", "tareas"];
            this.button = "tareas";
            this.sortField = "nombre";
            this.buttonField = "correo electrónico";
            break;
          case 'tareas':
            this.headings = ["Nombre", "Descripción", "Prioridad", "Fecha", "Empleado"];
            this.fields = ["nombre", "descripcion", "prioridad", "fecha", "empleado"];
            this.sortField = "fecha";
            break;
          case 'recintos':
            this.headings = ["Recinto", "Direccion", "Capacidad", "Contacto"]
            this.fields = ["nombre", "direccion", "capacidad", "contacto"]
            this.sortField = "nombre";
            break;
          case 'artistas':
            this.headings = ["Nombre y apellidos", "Dirección", "Grupo", "Teléfono", "Email"]
            this.fields = ["nombre", "dirección", "grupo", "teléfono", "email"];
            this.sortField = "nombre";
            break;
          case 'eventos':
            this.headings = ["Nombre", "Recinto", "Contacto", "Tipo", "Fecha", "Artistas"]
            this.fields = ["nombre", "recinto", "contacto", "tipo", "fecha", "artistas"]
            this.button = "artistas";
            this.buttonField = "nombre";
            this.sortField = "fecha";
            break;
        }
      })
    }

  isObject(val: any): boolean {
    return val !== null && typeof val === 'object';
  }

  filteredRows(): any[] {
    if (this.router.url !== "/recintos") {
      this.rows = this.rows.sort((a, b) =>
        a[this.sortField].localeCompare(b[this.sortField])
      );
    } else {
      this.rows = this.rows.sort((a,b) => b.capacidad - a.capacidad);
    }
    const lowerFilter = this.filterText ? this.filterText.toLowerCase() : null;

    return this.rows.filter(row => {
      let capacityOk = true;
      if (this.capacidadMax !== undefined && this.capacidadMax !== null) {
        capacityOk = row.capacidad <= this.capacidadMax;
      }
      let textOk = true;
      if (lowerFilter) {
        textOk = this.fields.some(field => {
          if (field !== 'button') {
            const fieldValue = row[field];
            if (fieldValue !== undefined && fieldValue !== null) {
              if (this.isObject(fieldValue)) {
                return (fieldValue.nombre || '').toString().toLowerCase().includes(lowerFilter);
              } else {
                return fieldValue.toString().toLowerCase().includes(lowerFilter);
              }
            }
          }
          return false;
        });
      }
      return capacityOk && textOk;
    });
  }


  goTo(rowElement: any) {
    if (this.router.url === '/eventos') {
      this.router.navigate(['/artistas/' + rowElement[this.buttonField]])
    } else {
      this.router.navigate([this.router.url.slice(0,-1) + "/" + rowElement[this.buttonField]]);
    }
  }
}
