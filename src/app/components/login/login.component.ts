import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, JwtPayload } from '../../services/auth.service';
import { CabeceraService } from '../../services/cabecera.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  message = '';
  loggedInUser: JwtPayload | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cabeceraService: CabeceraService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.authService.user$.subscribe(user => this.loggedInUser = user);
  }

  login() {
    if (this.loginForm.invalid) {
      this.message = 'Por favor, completa todos los campos';
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login({ username, password }).subscribe({
      next: () => {
        this.message = 'Inicio de sesión exitoso ✅';
        this.loginForm.reset();
        this.router.navigate(['/foro']);
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
    this.message = '';
    this.cabeceraService.setViewState('login');
    this.router.navigate(['/']);
  }

  showRegister(event: Event) {
    event.preventDefault();       // evita la navegación
    this.cabeceraService.setViewState('register'); // cambia la vista
  }
}
