import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.routes'),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes'),
  },
];
