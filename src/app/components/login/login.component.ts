import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';

  loggedInUser: string | null = localStorage.getItem('username');

  constructor(private authService: AuthService, private router: Router) {
    this.authService.user$.subscribe(user => this.loggedInUser = user);
  }

  login() {
    if (!this.username || !this.password) {
      this.message = 'Por favor, completa todos los campos';
      return;
    }

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          this.message = 'Inicio de sesión exitoso ✅';
          this.router.navigate(['/mi-perfil']);
        },
        error: err => {
          if (err.status === 401) this.message = '⚠️ Credenciales inválidas';
          else if (err.status === 403) this.message = '🚫 Acceso denegado';
          else if (err.status === 0) this.message = '❌ No se puede conectar con el servidor';
          else this.message = '⚠️ Error desconocido';
        }
      });
  }

  logout() {
    this.authService.logout();
    this.username = '';
    this.password = '';
    this.message = '';
    this.router.navigate(['/home']);
  }
}
