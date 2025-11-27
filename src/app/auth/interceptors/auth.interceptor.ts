import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const token = inject(AuthService).token();

  // Solo agregar token si existe y no es ruta pública
  if (token && !req.url.includes('/api/public/') && !req.url.includes('/api/v1/auth/')) {
    req = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${token}`),
    });
  }

  return next(req); //  Esto faltaba
}
