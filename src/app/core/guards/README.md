# Guards - Protección de Rutas

Este documento explica cómo funcionan los guards implementados en el sistema de reservas de hotel para proteger las rutas de la aplicación.

## 🛡️ Guards Implementados

### 1. **AuthGuard** (`src/app/core/guards/auth.guard.ts`)
**Propósito**: Proteger rutas que requieren autenticación.

**Funcionalidad**:
- Verifica si el usuario está autenticado usando `AuthService.checkAuthStatus()`
- Si no está autenticado → Redirige a `/auth/login`
- Si está autenticado → Permite acceso

**Aplicado en**:
- Todas las rutas del módulo `home` (requieren usuario autenticado)
- Todas las rutas del módulo `admin` (requieren usuario autenticado + rol admin)

### 2. **AdminGuard** (`src/app/core/guards/admin.guard.ts`)
**Propósito**: Proteger rutas administrativas que requieren permisos de administrador.

**Funcionalidad**:
- Verifica autenticación usando `AuthService.checkAuthStatus()`
- Verifica rol de admin usando `AuthService.isAdmin()`
- Si no es admin → Redirige según estado:
  - No autenticado → `/auth/login`
  - Autenticado pero no admin → `/home`

**Aplicado en**:
- Todas las rutas del módulo `admin`

### 3. **LoginGuard** (`src/app/core/guards/login.guard.ts`)
**Propósito**: Prevenir acceso a páginas de autenticación cuando ya está logueado.

**Funcionalidad**:
- Verifica si el usuario está autenticado
- Si está autenticado → Redirige automáticamente según rol:
  - Admin → `/admin`
  - Usuario normal → `/home`
- Si no está autenticado → Permite acceso a login/registro

**Aplicado en**:
- Todas las rutas del módulo `auth` (login, registro)

## 🗂️ Estructura de Guards

```
src/app/core/guards/
├── index.ts              # Exporta todos los guards
├── auth.guard.ts         # Protección de autenticación
├── admin.guard.ts        # Protección de rol admin
└── login.guard.ts        # Prevención de acceso cuando autenticado
```

## 🔄 Flujo de Navegación

### Usuario No Autenticado
```
/ → /auth/login (LoginGuard permite acceso)
/auth/login → ✅ Acceso permitido
/auth/register → ✅ Acceso permitido
/home/* → ❌ AuthGuard → /auth/login
/admin/* → ❌ AuthGuard → /auth/login
```

### Usuario Autenticado (Normal)
```
/ → /auth/login (LoginGuard redirige a /home)
/auth/login → ❌ LoginGuard → /home
/home/* → ✅ AuthGuard permite acceso
/admin/* → ❌ AdminGuard → /home
```

### Usuario Autenticado (Admin)
```
/ → /auth/login (LoginGuard redirige a /admin)
/auth/login → ❌ LoginGuard → /admin
/home/* → ✅ AuthGuard permite acceso
/admin/* → ✅ AuthGuard + AdminGuard permiten acceso
```

## 🔧 Integración con AuthService

Los guards dependen del `AuthService` que maneja:
- Estado de autenticación
- Información del usuario
- Verificación de roles
- Gestión de tokens

**Métodos utilizados**:
- `checkAuthStatus()`: Verifica autenticación con backend
- `isAuthenticated`: Computed signal para estado de autenticación
- `isAdmin()`: Verifica si el usuario tiene rol ADMIN

## 🛠️ Uso en Rutas

Los guards se aplican en `src/app/app.routes.ts`:

```typescript
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes'),
    canActivate: [LoginGuard], // Previene acceso si autenticado
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.routes'),
    canActivate: [AuthGuard], // Requiere autenticación
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes'),
    canActivate: [AuthGuard, AdminGuard], // Requiere auth + admin
  },
];
```

## 🔒 Seguridad Implementada

1. **Protección por capas**: AuthGuard + AdminGuard para rutas críticas
2. **Redirección automática**: Basada en estado de autenticación y rol
3. **Prevención de acceso no autorizado**: Guards bloquean rutas sensibles
4. **UX mejorada**: Redirecciones automáticas evitan páginas de error

## 🧪 Testing

Los guards han sido probados mediante:
- ✅ Build exitoso sin errores
- ✅ Tests unitarios pasan
- ✅ Navegación funciona correctamente
- ✅ Protección de rutas verificada

## 📝 Notas de Implementación

- Los guards usan observables para manejar estados asíncronos
- Integran perfectamente con el sistema de signals de Angular
- Son inyectables y siguen el patrón singleton
- Incluyen logging detallado para debugging
- Manejan errores de red y tokens expirados