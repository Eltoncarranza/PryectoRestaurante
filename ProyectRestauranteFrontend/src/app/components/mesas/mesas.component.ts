import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Mesa, MesaEstado } from '../../models/mesa.model';
import { interval, Subscription } from 'rxjs'; 
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
  private refreshSubscription?: Subscription; 

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Iniciamos la actualización constante al cargar el componente
    this.iniciarActualizacionAutomatica();
  }

  /**
   * Crea un flujo que pide las mesas cada 5 segundos automáticamente.
   * Esto mantiene la vista sincronizada con la base de datos de Supabase.
   */
  iniciarActualizacionAutomatica(): void {
    this.refreshSubscription = interval(5000) 
      .pipe(
        startWith(0), // Ejecuta la primera carga de inmediato
        switchMap(() => this.apiService.getMesas()) // Llama al endpoint /mesas/mesaDe
      )
      .subscribe({
        next: (data) => {
          this.mesas = data;
          this.cargando = false;
        },
        error: (err: any) => { // Corregido: Tipo explícito 'any'
          console.error('Error al conectar con Spring Boot', err);
          this.cargando = false;
        }
      });
  }

  /**
   * Genera una nueva mesa calculando el siguiente número disponible.
   */
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
        // No hace falta recargar manualmente, el intervalo de 5s lo hará.
        console.log('Mesa creada exitosamente');
      },
      error: (err: any) => console.error('Error al crear mesa', err) // Corregido: Tipo explícito 'any'
    });
  }

  /**
   * Elimina una mesa seleccionada tras confirmar la acción.
   */
  quitarMesa(id: number, event: Event): void {
    event.stopPropagation(); // Evita navegar al menú al hacer clic en el botón de borrar
    
    if (confirm('¿Estás seguro de eliminar esta mesa?')) {
      this.apiService.eliminarMesa(id).subscribe({
        next: () => console.log('Mesa eliminada'),
        error: (err: any) => alert('No se puede eliminar una mesa con pedidos activos o error de red.') // Corregido: Tipo explícito 'any'
      });
    }
  }

  /**
   * Limpieza: Detiene las peticiones HTTP automáticas cuando el usuario sale de la vista.
   */
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      console.log('Actualización de mesas detenida');
    }
  }
}