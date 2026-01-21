import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { map, tap } from 'rxjs/operators';

/**
 * Guard que previene acceso a páginas de login/registro
 * cuando el usuario ya está autenticado
 * Redirige automáticamente según el rol del usuario
 */
@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate() {
    return this.authService.checkAuthStatus().pipe(
      map((result) => {
        // Si no está autenticado, permitir acceso a login
        if (result === false) {
          console.log('✅ LoginGuard: Usuario no autenticado, permitiendo acceso a login');
          return true;
        }

        // Si está autenticado, no permitir acceso a login
        console.log('🚫 LoginGuard: Usuario ya autenticado, bloqueando acceso a login');
        return false;
      }),
      tap((canAccess) => {
        if (!canAccess) {
          // Redirigir según el rol del usuario
          const isAdmin = this.authService.isAdmin();
          if (isAdmin) {
            console.log('🔄 LoginGuard: Redirigiendo admin a dashboard');
            this.router.navigate(['/admin']);
          } else {
            console.log('🔄 LoginGuard: Redirigiendo usuario a home');
            this.router.navigate(['/home']);
          }
        }
      })
    );
  }
}