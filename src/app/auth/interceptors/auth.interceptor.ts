import { HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Obtener token del localStorage directamente para evitar problemas de timing
  const token = localStorage.getItem('token') || authService.token();

  // Solo evitar rutas de login/registro
  if (token && !req.url.includes('/api/v1/auth/login') && !req.url.includes('/api/v1/auth/register')) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Solo cerrar sesión si es un 401 en una ruta que no sea de auth
      if (error.status === 401 && !req.url.includes('/api/v1/auth/')) {
        console.warn('Token expirado o inválido, redirigiendo a login...');
        authService.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
}
