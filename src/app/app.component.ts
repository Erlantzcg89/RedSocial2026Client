import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuPrincipalComponent } from './components/menu-principal/menu-principal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuPrincipalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'redsocial2026client';
}
