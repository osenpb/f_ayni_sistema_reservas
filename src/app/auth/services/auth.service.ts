import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../interfaces/auth.interface';
import { UserResponse } from '../interfaces/userResponse.interface';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const baseUrl = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // Signals privados
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<UserResponse | null>(this.loadUserFromStorage());
  private _token = signal<string | null>(localStorage.getItem('token'));

  // Inicializar el estado de autenticación en el constructor
  constructor() {
    this.initializeAuth();
  }

  /**
   * Inicializa el estado de autenticación al cargar el servicio
   */
  private initializeAuth(): void {
    const token = localStorage.getItem('token');
    const user = this.loadUserFromStorage();

    if (token && user) {
      // Tenemos token y usuario en localStorage, verificar con backend
      this._token.set(token);
      this._user.set(user);
      this._authStatus.set('authenticated');

      // Verificar token en segundo plano
      this.verifyTokenInBackground();
    } else if (token) {
      // Solo tenemos token, necesitamos obtener usuario
      this._token.set(token);
      this._authStatus.set('checking');
    } else {
      // No hay sesión
      this._authStatus.set('not-authenticated');
    }
  }

  /**
   * Carga el usuario desde localStorage
   */
  private loadUserFromStorage(): UserResponse | null {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (e) {
      console.warn('Error parsing user from localStorage:', e);
      localStorage.removeItem('user');
    }
    return null;
  }

  /**
   * Verifica el token en segundo plano sin bloquear la UI
   */
  private verifyTokenInBackground(): void {
    this.me().subscribe({
      next: (user) => {
        console.log('✅ Token verificado, usuario:', user.username);
        this._user.set(user);
        this._authStatus.set('authenticated');
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: () => {
        console.log('⚠️ Token inválido, cerrando sesión');
        this.logout();
      },
    });
  }

  authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  user = computed<UserResponse | null>(() => this._user());
  token = computed(() => this._token());

  //helpers
  isAuthenticated = computed(() => this.authStatus() === 'authenticated');
  isChecking = computed(() => this.authStatus() === 'checking');

  /**
   * Registro de nuevo usuario
   */
  register(registerRequest: RegisterRequest): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/register`, {
        username: registerRequest.username,
        email: registerRequest.email,
        telefono: registerRequest.telefono,
        password: registerRequest.password,
      })
      .pipe(
        tap((resp: AuthResponse) => {
          this.handleLoginSuccess(resp);
        }),
        map(() => true),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  /**
   * Login del usuario
   */
  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, loginRequest).pipe(
      tap((resp) => {
        console.log('Login exitoso:', resp);
        this.handleLoginSuccess(resp);
      }),
      catchError((error) => this.handleAuthError(error))
    );
  }

  /**
   * Logout del usuario
   */
  logout() {
    console.log('Cerrando sesión...');

    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    console.log('✅ Sesión cerrada');
  }

  /**
   * Verifica el estado de autenticación
   * Ideal para llamar en el AppComponent al iniciar
   */
  checkAuthStatus(): Observable<boolean | UserResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No hay token, usuario no autenticado');
      this._authStatus.set('not-authenticated');
      this._user.set(null);
      return of(false);
    }

    // Si ya tenemos usuario cargado, no necesitamos llamar al backend
    const currentUser = this._user();
    if (currentUser) {
      console.log('Usuario ya cargado:', currentUser.username);
      this._authStatus.set('authenticated');
      return of(currentUser);
    }

    console.log('Token encontrado, verificando con backend...');
    this._token.set(token);

    // refresca el estado e info del usuario
    return this.me().pipe(
      tap((user) => {
        this._authStatus.set('authenticated');
        this._user.set(user);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Usuario autenticado correctamente');
      }),
      catchError(() => {
        console.log('Error al verificar token, cerrando sesión');
        this._authStatus.set('not-authenticated');
        this._user.set(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return of(false);
      })
    );
  }

  /**
   * Obtiene el usuario actual (sin signal)
   */
  getCurrentUser(): UserResponse | null {
    return this._user();
  }

  /**
   * Obtiene el token actual (sin signal)
   */
  getToken(): string | null {
    return this._token();
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this._user();
    return user?.role.rolename === role;
  }

  /**
   * Verifica si el usuario es admin
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /**
   * Maneja el éxito del login/registro
   */
  private handleLoginSuccess(resp: AuthResponse) {
    console.log('💾 Guardando datos de autenticación...');

    this._authStatus.set('authenticated');
    this._user.set(resp.user);
    this._token.set(resp.token);

    // Guardar en localStorage
    localStorage.setItem('token', resp.token);
    localStorage.setItem('user', JSON.stringify(resp.user));

    console.log('Datos guardados:', {
      user: resp.user,
      token: resp.token.substring(0, 20) + '...',
    });
  }

  /**
   * Maneja errores de autenticación
   */
  private handleAuthError(error: any) {
    console.error('❌ Error de autenticación:', error);

    // No cerrar sesión automáticamente en errores de conexión
    if (error.status === 0) {
      return throwError(() => ({
        ...error,
        userMessage: 'No se puede conectar con el servidor',
      }));
    }

    this.logout();

    // Extraer mensaje de error
    let errorMessage = 'Error desconocido';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 401) {
      errorMessage = 'Credenciales inválidas';
    } else if (error.status === 403) {
      errorMessage = 'No tienes permisos';
    }

    return throwError(() => ({
      ...error,
      userMessage: errorMessage,
    }));
  }

  me() {
    return this.http.get<UserResponse>(`${baseUrl}/auth/me`).pipe(
      tap((user: UserResponse) => {
        console.log('Usuario obtenido de /me:', user);
        this._user.set(user);
      })
    );
  }

  refreshUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${baseUrl}/auth/me`).pipe(
      tap((user) => {
        console.log('🔄 Usuario actualizado:', user);
        this._user.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
      catchError((error) => {
        console.error('❌ Error al refrescar usuario:', error);
        return throwError(() => error);
      })
    );
  }
}
