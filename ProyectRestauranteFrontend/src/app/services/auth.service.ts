import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Importante
import { Observable, tap } from 'rxjs'; // Importante

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = 'http://localhost:8080/api'; // Asegúrate de que esta sea tu URL
  private roleKey = 'user_role'; // Llave única para localStorage

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.url}/auth/login`, credentials).pipe(
      tap((res: any) => {
        if (res.status === 'success') {
          // Guardamos usando la llave única
          localStorage.setItem(this.roleKey, res.role); 
          localStorage.setItem('token', 'session_active'); 
          this.redirigir(res.role);
        }
      })
    );
  }

  // Un solo método getRole corregido
  getRole(): string {
    return localStorage.getItem(this.roleKey) || '';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.roleKey);
  }

  logout() {
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  private redirigir(role: string) {
    const rutas: any = {
      'ADMIN': '/admin/dashboard',
      'MESERO': '/mesas',
      'COCINERO': '/cocina'
    };
    this.router.navigate([rutas[role]]);
  }
}