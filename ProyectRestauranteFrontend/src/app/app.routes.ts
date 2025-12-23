import { Routes } from '@angular/router';
import { MesasComponent } from './components/mesas/mesas.component';
import { MenuComponent } from './components/menu/menu.component';
import { CocinaComponent } from './components/cocina/cocina.component';
import { CuentaComponent } from './components/cuenta/cuenta.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth-guard';

// Componentes Administrativos
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminPlatosComponent } from './components/admin/admin-platos/admin-platos.component';
import { AdminVentasComponent } from './components/admin/admin-ventas/admin-ventas.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // ==========================================
  // RUTAS DE ADMINISTRACIÓN
  // ==========================================
  { 
    path: 'admin/dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [authGuard], 
    data: { role: 'ADMIN' } 
  },
  { 
    path: 'admin/platos', 
    component: AdminPlatosComponent, 
    canActivate: [authGuard], 
    data: { role: 'ADMIN' } 
  },
  { 
    path: 'admin/ventas', 
    component: AdminVentasComponent, 
    canActivate: [authGuard], 
    data: { role: 'ADMIN' } 
  },

  // ==========================================
  // RUTAS OPERATIVAS (MESERO Y ADMIN)
  // ==========================================
  { 
    path: 'mesas', 
    component: MesasComponent, 
    canActivate: [authGuard], 
    data: { role: ['ADMIN', 'MESERO'] } 
  },
  { 
    path: 'ordenar/:idMesa', 
    component: MenuComponent, 
    canActivate: [authGuard], 
    data: { role: ['ADMIN', 'MESERO'] } 
  },
  { 
    path: 'menu/:idMesa', 
    component: MenuComponent, 
    canActivate: [authGuard], 
    data: { role: ['ADMIN', 'MESERO'] } 
  },
  { 
    path: 'cuenta/:idMesa', 
    component: CuentaComponent, 
    canActivate: [authGuard], 
    data: { role: ['ADMIN', 'MESERO'] } 
  },

  // ==========================================
  // RUTA DE COCINA
  // ==========================================
  { 
    path: 'cocina', 
    component: CocinaComponent, 
    canActivate: [authGuard], 
    data: { role: ['ADMIN', 'COCINERO'] } 
  },

  // RUTA COMODÍN (Debe ir siempre al final)
  { path: '**', redirectTo: '/login' }
];