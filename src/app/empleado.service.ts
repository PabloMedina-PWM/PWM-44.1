// src/app/services/empleado.service.ts
import { Injectable } from '@angular/core';
import {addDoc, collection, doc, Firestore, getDoc, updateDoc} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private coleccion = 'empleado';

  constructor(private firestore: Firestore) {}

  addEmpleado(data: any) {
    const empleadosCollection = collection(this.firestore, 'empleado');
    return addDoc(empleadosCollection, data);
  }

  updateEmpleadoId(id: string) {
    const empleadoRef = doc(this.firestore, 'empleado', id);
    return updateDoc(empleadoRef, { id });
  }

  getEmpleadoById(id: string) {
    const docRef = doc(this.firestore, 'empleado', id);
    return getDoc(docRef);
  }
}
