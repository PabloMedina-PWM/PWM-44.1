// src/app/services/empleado.service.ts
import { Injectable } from '@angular/core';
import {addDoc, collection, doc, Firestore, getDoc, getDocs, query, updateDoc, where} from '@angular/fire/firestore';
import {FirestoreService} from './firestore.service';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private coleccion = 'empleado';

  constructor(private firestore: Firestore, private firestoreService: FirestoreService) {}

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

  async getEmpleadoByEmail(email: string) {
    const empleadosRef = collection(this.firestore, 'empleado');
    const q = query(empleadosRef, where('correo electrónico', '==', email));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data(); // Retorna el primer empleado encontrado
    } else {
      return null; // No se encontró ningún empleado con ese email
    }
  }
}
