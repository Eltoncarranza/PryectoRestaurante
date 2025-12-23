import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Obtener y limpiar el rol (añadimos .trim() para evitar espacios ocultos)
  const userRole = (authService.getRole() || '').toUpperCase().trim();
  const rolesPermitidos = route.data['role'];

  // 2. Verificar si el usuario está logueado
  if (!authService.isAuthenticated()) {
    console.error('Guard: Usuario no autenticado. Redirigiendo a Login.');
    router.navigate(['/login']);
    return false;
  }

  // 3. Verificar si la ruta tiene restricciones de rol
  if (rolesPermitidos) {
    const rolesArray = (Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos])
                        .map(r => r.toUpperCase().trim());

    const tienePermiso = rolesArray.includes(userRole);

    if (!tienePermiso) {
      console.warn(`Guard: Acceso DENEGADO. Rol actual: [${userRole}]. Permitidos: ${rolesArray}`);
      alert(`Tu rol (${userRole}) no tiene permiso para entrar aquí.`);
      
      // SOLUCIÓN: Si no tiene permiso, lo mandamos al login para que cambie de usuario
      // Evitamos el bucle de redirigir a '/mesas' si ya estamos fallando en entrar ahí
      router.navigate(['/login']);
      return false;
    }
  }

  console.log(`Guard: Acceso PERMITIDO para el rol ${userRole} a la ruta ${state.url}`);
  return true;
};