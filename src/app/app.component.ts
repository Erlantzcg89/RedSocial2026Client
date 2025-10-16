import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuPrincipalComponent } from './components/menu-principal/menu-principal.component';
import { LoginComponent } from './components/login/login.component';
import { BannerComponent } from './components/banner/banner.component';
import { RegisterComponent } from './components/register/register.component';
import { CabeceraService } from './services/cabecera.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BannerComponent,
    MenuPrincipalComponent,
    LoginComponent,
    RegisterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'redsocial2026client';
  viewState: 'login' | 'register' | 'none' = 'login';

  constructor(private cabeceraService: CabeceraService) {
    this.cabeceraService.viewState$.subscribe(state => {
      this.viewState = state;
    });
  }
}
