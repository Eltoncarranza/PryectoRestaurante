import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Mesa, MesaEstado } from '../../models/mesa.model';
import { interval, Subscription } from 'rxjs'; // Importamos para el tiempo real
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit, OnDestroy {
  mesas: Mesa[] = [];
  cargando: boolean = true;
  private refreshSubscription?: Subscription; // Para detener la actualización al salir

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Iniciamos la actualización constante
    this.iniciarActualizacionAutomatica();
  }

  /**
   * Crea un flujo que pide las mesas cada 5 segundos automáticamente.
   */
  iniciarActualizacionAutomatica(): void {
  this.refreshSubscription = interval(5000) 
    .pipe(
      startWith(0), 
      switchMap(() => this.apiService.getMesas()) 
    )
    .subscribe({
      next: (data) => {
        this.mesas = data;
        this.cargando = false;
      },
      error: (err: any) => { // <--- AGREGAR ": any" AQUÍ
        console.error('Error al conectar con Spring Boot', err);
        this.cargando = false;
      }
    });
}

  agregarNuevaMesa(): void {
    const proximoNumero = this.mesas.length > 0 
      ? Math.max(...this.mesas.map(m => m.numero)) + 1 
      : 1;

    const nuevaMesa: Partial<Mesa> = {
      numero: proximoNumero,
      estado: MesaEstado.LIBRE, 
      color: '#28a745' 
    };

    this.apiService.crearMesa(nuevaMesa).subscribe({
      next: () => {
        // No es necesario llamar a obtenerMesas(), el intervalo lo hará solo.
        console.log('Mesa creada exitosamente');
      },
      error: (err) => console.error('Error al crear mesa', err)
    });
  }

  quitarMesa(id: number, event: Event): void {
    event.stopPropagation(); 
    
    if (confirm('¿Estás seguro de eliminar esta mesa?')) {
      this.apiService.eliminarMesa(id).subscribe({
        next: () => console.log('Mesa eliminada'),
        error: (err) => alert('No se puede eliminar una mesa con pedidos activos.')
      });
    }
  }

  /**
   * Limpieza vital: Detiene el reloj cuando el usuario sale de la pantalla de mesas.
   * Si no se hace, la app seguirá pidiendo datos al servidor infinitamente.
   */
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      console.log('Actualización de mesas detenida');
    }
  }
}