import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent {
  loggedIn = !!localStorage.getItem('token');

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => this.loggedIn = !!user);
  }
}
