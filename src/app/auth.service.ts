import { Injectable } from '@angular/core';
import {
  Auth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  User,
  setPersistence, user,
  browserSessionPersistence, signOut
} from "@angular/fire/auth";
import { firebaseConfig } from '../config';
import {from, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;
  loggedIn: boolean = false;

  constructor(private firebaseAuth: Auth) {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
    this.user$ = user(this.firebaseAuth);
  }

  inicioSesion(email: string, password: string): Observable<User | null> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => {
      let user = this.firebaseAuth.currentUser;
      this.loggedIn = true;
      return user;
    });
    return from(promise);
  }

  cerrarSesion(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
      sessionStorage.clear();
      this.loggedIn = false;
    });
    return from(promise);
  }

  comprobarRol(): string {

    return ""
  }

}
