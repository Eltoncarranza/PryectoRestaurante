import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Pedido } from '../../models/pedido.model';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-cocina',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.css']
})
export class CocinaComponent implements OnInit, OnDestroy {
  pedidosPendientes: Pedido[] = [];
  private refreshSub?: Subscription;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Escucha pedidos nuevos cada 5 segundos
    this.refreshSub = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.apiService.getPedidos())
      )
      .subscribe({
        next: (data: any) => {
          // Filtramos para mostrar solo lo que no está listo
          this.pedidosPendientes = data.filter((p: any) => !p.pedidoListo);
        },
        error: (err: any) => console.error('Error en cocina:', err)
      });
  }

  // En cocina.component.ts, cambia la función marcarListo:
marcarListo(id: number | undefined): void {
  if (!id) return; // Si no hay ID, no hace nada

  this.apiService.marcarPedidoListo(id).subscribe({
    next: () => {
      console.log('Pedido despachado');
      // Opcional: filtrar localmente para que desaparezca rápido
      this.pedidosPendientes = this.pedidosPendientes.filter(p => p.id !== id);
    },
    error: (err: any) => alert('Error al actualizar pedido')
  });
}

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }
}