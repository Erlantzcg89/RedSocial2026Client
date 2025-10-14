import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true; // usuario logueado
    } else {
      this.router.navigate(['/home']); // redirige a home si no está logueado
      return false;
    }
  }
}
