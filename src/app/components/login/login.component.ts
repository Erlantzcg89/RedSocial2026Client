import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    // Validar campos vacíos
    if (!this.username || !this.password) {
      this.message = 'Por favor, completa todos los campos';
      return;
    }

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          if (res?.token) {
            localStorage.setItem('token', res.token);
            this.message = 'Inicio de sesión exitoso ✅';
            this.router.navigate(['/home']); // puedes cambiar la ruta si lo deseas
          } else {
            this.message = 'Respuesta inesperada del servidor';
          }
        },
        error: (err) => {
          console.error('Error en login:', err);

          // Manejo detallado por código de estado
          if (err.status === 401) {
            this.message = 'Credenciales inválidas';
          } else if (err.status === 403) {
            this.message = 'Acceso denegado. Verifica tus credenciales o permisos';
          } else if (err.status === 0) {
            this.message = 'No se puede conectar con el servidor';
          } else if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Error desconocido en el servidor';
          }
        }
      });
  }
}
