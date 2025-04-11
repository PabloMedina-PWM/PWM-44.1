import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {
  constructor(private storage: Storage) {}

  getUrl(name: string): Observable<string> {
    const fileRef = ref(this.storage, name);
    return from(getDownloadURL(fileRef))
  }

}
