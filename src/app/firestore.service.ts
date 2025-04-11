import {inject, Injectable} from '@angular/core';
import {
  Firestore, collection, collectionData, deleteDoc, doc, docData, addDoc, updateDoc
} from '@angular/fire/firestore'
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  database: Firestore = inject(Firestore);

  getCollection<T>(collectionName: string): Observable<T[]> {
    const collectionRef = collection(this.database, collectionName);
    return collectionData(collectionRef, { idField: 'id' }) as Observable<T[]>;
  }

  getDocument<T>(collectionName: string, id: string): Observable<T | undefined> {
    const documentRef = doc(this.database, collectionName, id);
    return docData(documentRef, { idField: 'id' }) as Observable<T | undefined>;
  }

  addDocument<T>(collectionName: string, data: Omit<T, 'id'>): Promise<any> {
    const collectionRef = collection(this.database, collectionName);
    return addDoc(collectionRef, data);
  }

  updateDocument<T extends { id?: string }>(collectionName: string, data: T): Promise<void> {
    if (!data?.id) {
      return Promise.reject('El documento necesita un ID para ser actualizado.');
    }
    const documentRef = doc(this.database, collectionName, data.id);
    return updateDoc(documentRef, data);
  }

  deleteDocument(collectionName: string, id: string): Promise<void> {
    const documentRef = doc(this.database, collectionName, id);
    return deleteDoc(documentRef);
  }

}
