import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { ForoComponent } from './components/foro/foro.component';
import { AuthGuard } from './guards/auth.guard';
import { TestComponent } from './components/test/test.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mi-perfil', component: MiPerfilComponent, canActivate: [AuthGuard]  },
  { path: 'foro', component: ForoComponent, canActivate: [AuthGuard]  },
  { path: 'test', component: TestComponent, canActivate: [AuthGuard]  },
  { path: '**', redirectTo: '' }  // redirige rutas no existentes al home
];
