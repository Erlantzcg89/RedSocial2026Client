import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  message = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.message = 'Por favor, completa todos los campos correctamente';
      return;
    }

    const { username, password, email } = this.registerForm.value;

    this.authService.register({ username, password, email }).subscribe({
      next: () => {
        this.message = 'Usuario registrado y logueado automáticamente ✅';
        this.registerForm.reset();

        // Navegar directamente al perfil del usuario logueado
        this.router.navigate(['/mi-perfil']);
      },
      error: err => {
        if (err.status === 0) this.message = '❌ No se puede conectar con el servidor';
        else if (err.status === 400) this.message = '⚠️ Datos inválidos o usuario ya existente';
        else if (err.status === 401) this.message = '⚠️ No autorizado';
        else if (err.status === 403) this.message = '🚫 Acceso denegado';
        else if (err.error?.message) this.message = err.error.message;
        else this.message = '⚠️ Error desconocido al registrar';
      }
    });
  }
}
