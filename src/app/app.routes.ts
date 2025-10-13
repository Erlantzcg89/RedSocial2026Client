import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { ForoComponent } from './components/foro/foro.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mi-perfil', component: MiPerfilComponent },
  { path: 'foro', component: ForoComponent },
  { path: '**', redirectTo: '' }  // redirige rutas no existentes al home
];
