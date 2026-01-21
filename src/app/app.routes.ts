import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard, LoginGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes'),
    canActivate: [LoginGuard], // Prevenir acceso si ya está autenticado
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.routes'),
    canActivate: [AuthGuard], // Requiere autenticación
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes'),
    canActivate: [AuthGuard, AdminGuard], // Requiere autenticación + rol admin
  },
];
