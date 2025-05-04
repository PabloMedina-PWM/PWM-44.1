import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router:Router = inject(Router);
  if (localStorage.getItem("user") === null) {
    router.navigate(['']);
    return false;
  }
  return true;
};
