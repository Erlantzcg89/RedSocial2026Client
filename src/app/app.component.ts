import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuPrincipalComponent } from './components/menu-principal/menu-principal.component';
import { LoginComponent } from './components/login/login.component';
import { BannerComponent } from './components/banner/banner.component';
import { RegisterComponent } from './components/register/register.component';
import { CabeceraService } from './services/cabecera.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BannerComponent,
    MenuPrincipalComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'redsocial2026client';
  viewState: 'login' | 'register' | 'none' = 'login';

  constructor(private cabeceraService: CabeceraService, private router: Router) {
    this.cabeceraService.viewState$.subscribe(state => {
      this.viewState = state;
    });

    // 👉 Detectar navegación y hacer scroll
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Esperamos un poquito a que Angular renderice el nuevo componente
        setTimeout(() => {
          const contentElement = document.querySelector('router-outlet');
          if (contentElement) {
            // Desplazamiento suave hasta el contenido
            window.scrollTo({
              top: contentElement.getBoundingClientRect().top + window.scrollY - 100, // ajuste según tu banner
              behavior: 'smooth'
            });
          } else {
            // Si no se encuentra, hacer scroll al inicio
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      });
  }
}
