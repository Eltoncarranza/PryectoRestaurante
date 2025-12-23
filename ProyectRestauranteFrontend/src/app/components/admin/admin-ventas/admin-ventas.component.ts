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

  cargarReporte(): void {
    this.apiService.getReporteVentas().subscribe({
      next: (data) => {
        this.ventas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener reporte de ventas', err);
        this.cargando = false;
      }
    });
  }
}