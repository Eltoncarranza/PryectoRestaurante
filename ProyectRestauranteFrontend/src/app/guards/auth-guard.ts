import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Obtener y normalizar el rol del usuario actual
  // Usamos .toUpperCase() para asegurar compatibilidad con el Backend (ADMIN, MESERO, COCINERO)
  const userRole = (authService.getRole() || '').toUpperCase(); 
  
  // 2. Obtener los roles permitidos definidos en app.routes
  const rolesPermitidos = route.data['role'];

  // 3. Verificar si hay una sesión activa
  if (!authService.isAuthenticated()) {
    console.warn('Acceso denegado: Usuario no autenticado');
    router.navigate(['/login']); //
    return false;
  }

  // 4. Si la ruta requiere roles específicos, verificar permisos
  if (rolesPermitidos) {
    // Normalizamos rolesPermitidos a un arreglo en mayúsculas para evitar errores de escritura
    const rolesArray = (Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos])
                        .map(r => r.toUpperCase());

    const tienePermiso = rolesArray.includes(userRole);

    if (!tienePermiso) {
      console.error(`Acceso denegado: El rol ${userRole} no está en la lista permitida ${rolesArray}`);
      alert('No tienes permisos para acceder a esta sección.'); //
      
      // Mejora UX: Redirigir a una página segura según el rol real del usuario
      if (userRole === 'ADMIN') router.navigate(['/admin']);
      else if (userRole === 'MESERO') router.navigate(['/mesas']);
      else if (userRole === 'COCINERO') router.navigate(['/cocina']);
      else router.navigate(['/login']);
      
      return false;
    }
  }

  // Si pasa todas las validaciones, permite el acceso
  return true;
};