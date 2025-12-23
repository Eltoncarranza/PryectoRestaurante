import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cocina',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cocina.component.html'
})
export class CocinaComponent implements OnInit {
  pedidosPendientes: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarPedidos();
    // Opcional: Recargar cada 30 segundos para ver nuevos pedidos
    setInterval(() => this.cargarPedidos(), 1000);
  }

 cargarPedidos(): void {
  this.apiService.getPedidos().subscribe({
    next: (data) => {
      this.pedidosPendientes = data.filter((p: any) => !p.pedidoListo);
    },
    error: (err: any) => console.error('Error al cargar pedidos', err) // <--- AGREGAR ": any"
  });
}


  marcarListo(id: number): void {
    this.apiService.marcarPedidoListo(id).subscribe({
      next: () => {
        this.cargarPedidos();
      },
      error: (err) => alert('No se pudo marcar el pedido como listo.')
    });
  }
}