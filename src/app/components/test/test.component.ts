import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  @ViewChild('messageRef') messageRef!: ElementRef;

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
        this.scrollToMessage();
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
        this.scrollToMessage();
      }
    });
  }

  private scrollToMessage() {
    // Espera un ciclo de renderizado para que *ngIf haya creado el elemento
    setTimeout(() => {
      if (this.messageRef) {
        this.messageRef.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 0);
  }
}
