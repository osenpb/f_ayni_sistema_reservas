import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { map, tap } from 'rxjs/operators';

/**
 * Guard que protege rutas que requieren autenticación
 * Redirige a login si el usuario no está autenticado
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate() {
    return this.authService.checkAuthStatus().pipe(
      map((result) => {
        // Si es boolean false, no está autenticado
        if (result === false) {

          return false;
        }

        // Si es un UserResponse, está autenticado
        return true;
      }),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/auth/login']);
        }
      })
    );
  }
}
