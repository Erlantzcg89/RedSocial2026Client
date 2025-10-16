import { Component} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  imports: [CommonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
  
  message = '';
  loading = false;

  constructor(private authService: AuthService) {}

  loadTestMessage() {
    this.loading = true;
    this.message = '';

    this.authService.test().subscribe({
      next: (res) => {
        this.message = typeof res === 'string' ? res : '✅ Conectado correctamente';
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al conectar:', err);
        if (err.status === 0) {
          this.message = '❌ No se puede conectar con el servidor';
        } else if (err.status === 401) {
          this.message = '⚠️ No autorizado. Por favor, inicia sesión nuevamente';
        } else if (err.status === 403) {
          this.message = '🚫 Acceso denegado. No tienes permiso';
        } else {
          this.message = err.error?.message || '⚠️ Error desconocido';
        }
        this.loading = false;
      }
    });
  }
  
}
