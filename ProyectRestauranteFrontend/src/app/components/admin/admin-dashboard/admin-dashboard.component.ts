import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Mesa } from '../../../models/mesa.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  mesas: Mesa[] = [];
  totalVentasHoy: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getMesas().subscribe(data => this.mesas = data);
    // Simulación de carga de ventas totales para el dashboard
    this.apiService.getReporteVentas().subscribe(ventas => {
      this.totalVentasHoy = ventas.reduce((acc, v) => acc + v.total, 0);
    });
  }

  get conteoMesas() {
    return {
      total: this.mesas.length,
      ocupadas: this.mesas.filter(m => m.estado !== 'LIBRE').length,
      libres: this.mesas.filter(m => m.estado === 'LIBRE').length
    };
  }
}