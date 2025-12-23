import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = 'http://localhost:8080/api'; 
  private roleKey = 'user_role'; 

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.url}/auth/login`, credentials).pipe(
      tap((res: any) => {
        // CORRECCIÓN: Java devuelve 'rol', no 'role'. No buscamos 'status' porque no se envía.
        if (res && res.rol) {
          const userRole = res.rol.toUpperCase();
          localStorage.setItem(this.roleKey, userRole);
          localStorage.setItem('token', 'session_active'); 
          
          console.log('Sesión iniciada. Rol detectado:', userRole);
          this.redirigir(userRole);
        }
      })
    );
  }

  getRole(): string {
    return localStorage.getItem(this.roleKey) || '';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.roleKey);
  }

  private redirigir(role: string) {
    const rutas: any = {
      'ADMIN': '/admin/dashboard',
      'MESERO': '/mesas',
      'COCINERO': '/cocina'
    };
    
    const destino = rutas[role];
    if (destino) {
      this.router.navigate([destino]);
    } else {
      console.error('Rol no reconocido:', role);
      this.router.navigate(['/login']);
    }
  }
}