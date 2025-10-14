import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  username = '';
  password = '';
  message = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    if (!this.username || !this.password) {
      this.message = 'Por favor, completa todos los campos';
      return;
    }

    this.authService.register({ username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          this.message = 'Usuario registrado exitosamente ✅';
          // redirige al login después de registrarse
          // setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          console.error('Error en registro:', err);

          if (err.status === 0) {
            this.message = '❌ No se puede conectar con el servidor';
          } else if (err.status === 400) {
            this.message = '⚠️ Datos inválidos o usuario ya existente';
          } else if (err.status === 401) {
            this.message = '⚠️ No autorizado';
          } else if (err.status === 403) {
            this.message = '🚫 Acceso denegado';
          } else if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = '⚠️ Error desconocido al registrar';
          }
        }
      });
  }
}
