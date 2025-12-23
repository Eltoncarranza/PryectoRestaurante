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
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService) {}

  ingresar() {
    if (!this.credentials.email || !this.credentials.password) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        // La redirección ocurre automáticamente en el tap del AuthService
      },
      error: (err: any) => {
        console.error('Error en login', err);
        alert('Correo o contraseña incorrectos.');
      }
    });
  }
}