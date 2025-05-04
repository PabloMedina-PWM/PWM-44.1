import { Injectable } from '@angular/core';
import {addDoc, collection, doc, Firestore, getDoc, getDocs, updateDoc} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class EventoService {

  constructor(private firestore: Firestore) {}

  addEvento(data: any) {
    const eventosCollection = collection(this.firestore, 'eventos');
    return addDoc(eventosCollection, data);
  }

  updateEventoId(id: string) {
    const eventoRef = doc(this.firestore, 'eventos', id);
    return updateDoc(eventoRef, { id });
  }

  getEventoById(id: string) {
    const docRef = doc(this.firestore, 'eventos', id);
    return getDoc(docRef);
  }

  async getNombresRecintos(): Promise<string[]> {
    const recintosRef = collection(this.firestore, 'recintos');
    const snapshot = await getDocs(recintosRef);
    return snapshot.docs.map(doc => doc.data()['nombre']);
  }
}
