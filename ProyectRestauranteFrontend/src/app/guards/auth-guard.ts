import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getRole(); // Obtenemos el rol guardado (ej: 'MESERO')
  const rolesPermitidos = route.data['role']; // Obtenemos lo definido en app.routes

  // 1. Verificar si hay sesión
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Verificar permisos (soporta tanto un solo string como un arreglo)
  if (rolesPermitidos) {
    const tienePermiso = Array.isArray(rolesPermitidos) 
      ? rolesPermitidos.includes(userRole) 
      : rolesPermitidos === userRole;

    if (!tienePermiso) {
      alert('Acceso Denegado: No tienes permisos para esta sección.');
      // Opcional: Redirigir a una ruta según su rol real
      return false;
    }
  }

  return true;
};