import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Activa el sistema de rutas y el AuthGuard
    provideHttpClient()    // Permite que la App hable con tu API en Spring Boot
  ]
};