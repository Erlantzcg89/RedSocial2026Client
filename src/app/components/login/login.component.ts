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
  loggedInUser: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Cargar sesión activa si existe
    const storedUser = localStorage.getItem('username');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      this.loggedInUser = storedUser;
    }
  }

  login() {
    if (!this.username || !this.password) {
      this.message = 'Por favor, completa todos los campos';
      return;
    }

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          if (res?.token) {
            // Guardar sesión local
            localStorage.setItem('token', res.token);
            localStorage.setItem('username', this.username);

            this.loggedInUser = this.username;
            this.message = 'Inicio de sesión exitoso ✅';
            this.router.navigate(['/mi-perfil']);
          } else {
            this.message = 'Respuesta inesperada del servidor';
          }
        },
        error: (err) => {
          console.error('Error en login:', err);
          if (err.status === 401) {
            this.message = '⚠️ Credenciales inválidas';
          } else if (err.status === 403) {
            this.message = '🚫 Acceso denegado';
          } else if (err.status === 0) {
            this.message = '❌ No se puede conectar con el servidor';
          } else {
            this.message = '⚠️ Error desconocido';
          }
        }
      });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.loggedInUser = null;
    this.username = '';
    this.password = '';
    this.message = 'Sesión cerrada correctamente';
    this.router.navigate(['/home']);
  }
}
