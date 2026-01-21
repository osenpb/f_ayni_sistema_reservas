import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { map, tap } from 'rxjs/operators';

/**
 * Guard que protege rutas administrativas
 * Solo permite acceso a usuarios con rol ADMIN
 */
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate() {
    return this.authService.checkAuthStatus().pipe(
      map((result) => {
        // Si no está autenticado, rechazar
        if (result === false) {
     
          return false;
        }

        // Verificar si es admin
        const isAdmin = this.authService.isAdmin();
        console.log('🔍 AdminGuard: Verificando rol de admin:', isAdmin);

        if (!isAdmin) {
          return false;
        }


        return true;
      }),
      tap((isAuthorized) => {
        if (!isAuthorized) {
          // Si no está autenticado, redirigir a login
          if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/auth/login']);
          } else {
            // Si está autenticado pero no es admin, redirigir a home
            this.router.navigate(['/home']);
          }
        }
      })
    );
  }
}
