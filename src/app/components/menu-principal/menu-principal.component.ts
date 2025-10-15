import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent {
  loggedIn = false;

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => this.loggedIn = !!user);
  }
}
