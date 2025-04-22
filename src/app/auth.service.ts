import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, browserSessionPersistence, setPersistence, user, User } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;
  loggedIn: boolean = false;
  firestore: Firestore = inject(Firestore);
  firebaseAuth: Auth = inject(Auth);

  constructor() {
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
      localStorage.clear();
    });
    return from(promise);
  }


  async comprobarRol(): Promise<string> {
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {

      const q = query(
        collection(this.firestore, 'empleado'),
        where('correo electrónico', '==', userEmail)
      );

      try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          console.log('Correo electrónico encontrado:', data['correo electrónico']);
          return data['rol'];
        } else {
          console.log('No se encontró el documento de usuario en Firestore');
          return 'usuario';
        }
      } catch (error) {
        console.error('Error al consultar Firestore:', error);
        return 'usuario';
      }
    } else {
      console.log('Correo electrónico no encontrado en localStorage');
      return 'usuario';
    }
  }
}


