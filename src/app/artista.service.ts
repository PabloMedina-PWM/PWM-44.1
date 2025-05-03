import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc, setDoc, updateDoc, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ArtistaService {

  constructor(private firestore: Firestore) {}

  addArtista(data: any) {
    const artistasCollection = collection(this.firestore, 'artistas');
    return addDoc(artistasCollection, data);
  }

  getArtistaById(id: string) {
    const artistaRef = doc(this.firestore, 'artistas', id);
    return getDoc(artistaRef);
  }

  updateArtista(id: string, data: any) {
    const artistaRef = doc(this.firestore, 'artistas', id);
    return updateDoc(artistaRef, data);
  }

  updateArtistaId(id: string) {
    const artistaRef = doc(this.firestore, 'artistas', id);
    return updateDoc(artistaRef, { id });
  }
}
