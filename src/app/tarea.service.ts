import { Injectable } from '@angular/core';
import {collection, doc, Firestore, getDoc, setDoc, updateDoc, addDoc, getDocs} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  constructor(private firestore: Firestore) {}

  addTarea(data: any) {
    const tareasCollection = collection(this.firestore, 'tareas');
    return addDoc(tareasCollection, data);
  }

  updateTareaId(id: string) {
    const tareaRef = doc(this.firestore, 'tareas', id);
    return updateDoc(tareaRef, { id });
  }

  async getNombresEmpleados(): Promise<string[]> {
    const empleadosRef = collection(this.firestore, 'empleado');
    const snapshot = await getDocs(empleadosRef);
    return snapshot.docs.map(doc => doc.data()['nombre']);
  }

  getTareaById(id: string) {
    const docRef = doc(this.firestore, 'tareas', id);
    return getDoc(docRef);
  }
}
