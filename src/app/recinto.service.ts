// src/app/recinto.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  DocumentData,
  DocumentSnapshot, getDocs, query, where
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class RecintoService {
  constructor(private firestore: Firestore) {}

  getRecintoById(id: string): Promise<DocumentSnapshot<DocumentData>> {
    const recintoDoc = doc(this.firestore, `recintos/${id}`);
    return getDoc(recintoDoc);
  }

  getProvincias(): Promise<string[]> {
    const provinciasRef = collection(this.firestore, 'provincias');
    return getDocs(provinciasRef).then((querySnapshot) => {
      return querySnapshot.docs.map(doc => doc.data()['nombre']);
    });
  }

  addRecinto(data: any) {
    // crea referencia a la colección "recintos"
    const recintosCol = collection(this.firestore, 'recintos');
    // añade un documento
    return addDoc(recintosCol, data);
  }

  updateRecinto(id: string, data: any) {
    const docRef = doc(this.firestore, 'recintos', id);
    return updateDoc(docRef, data);
  }



  updateRecintoId(id: string) {
    const recintoDoc = doc(this.firestore, 'recintos', id);
    return updateDoc(recintoDoc, { id: id });
  }
}
