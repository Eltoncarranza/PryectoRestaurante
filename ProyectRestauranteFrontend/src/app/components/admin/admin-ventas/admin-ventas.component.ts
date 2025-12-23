import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-ventas.component.html',
  styleUrls: ['./admin-ventas.component.css']
})
export class AdminVentasComponent implements OnInit {
  ventas: any[] = [];
  cargando: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarReporte();
  }

  /**
   * Carga la lista de ventas desde el backend.
   */
  cargarReporte(): void {
    this.apiService.getReporteVentas().subscribe({
      // CORRECCIÓN: Se agrega ": any" para evitar el error TS7006
      next: (data: any) => {
        this.ventas = data;
        this.cargando = false;
        console.log('Reporte de ventas cargado', data);
      },
      // CORRECCIÓN: Se agrega ": any" para evitar el error TS7006
      error: (err: any) => {
        console.error('Error al obtener reporte de ventas', err);
        this.cargando = false;
      }
    });
  }

  /**
   * Mejora: Cálculo automático del total recaudado en el reporte actual
   */
  get recaudacionTotal(): number {
    return this.ventas.reduce((acc, venta) => acc + (venta.total || 0), 0);
  }
}