import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Objeto para vincular con el [(ngModel)] de tu HTML
  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ingresar() {
    if (!this.credentials.email || !this.credentials.password) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // El AuthService se encarga de guardar el rol y redirigir
        console.log('Login exitoso', response);
      },
      // CORRECCIÓN VITAL: Añadir ": any" para evitar el error TS7006
      error: (err: any) => {
        console.error('Error en login', err);
        alert('Credenciales incorrectas o error de conexión con el servidor.');
      }
    });
  }
}