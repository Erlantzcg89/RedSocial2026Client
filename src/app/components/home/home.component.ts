import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // <--- Import necesario
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink], // <--- Aquí lo agregas
  templateUrl: './home.component.html'
})
export class HomeComponent {
  testMessage = '';

  constructor(private authService: AuthService) {}

  runTest() {
    this.authService.test().subscribe({
      next: (res) => this.testMessage = res,
      error: () => this.testMessage = 'Error al obtener el mensaje'
    });
  }
}
