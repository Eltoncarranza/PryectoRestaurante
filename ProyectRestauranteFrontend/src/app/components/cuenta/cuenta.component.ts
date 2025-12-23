import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuenta.component.html'
})
export class CuentaComponent implements OnInit {
  mesaId!: number;
  mesa: any;
  montoEntregado: number = 0;
  metodoPago: string = 'EFECTIVO'; // Coincide con el Enum MetodoPago del backend

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtenemos el ID de la mesa desde la URL
    this.mesaId = Number(this.route.snapshot.paramMap.get('idMesa'));
    this.cargarDetallesMesa();
  }

  cargarDetallesMesa() {
    this.apiService.getMesa(this.mesaId).subscribe({
      next: (data) => {
        this.mesa = data;
        // Si la mesa tiene un pedido activo, inicializamos el monto con el total
        if (this.mesa && this.mesa.pedidoActual) {
          this.montoEntregado = this.calcularTotal();
        }
      },
      error: (err) => console.error('Error al cargar la cuenta', err)
    });
  }

  // Calcula el total sumando (precio * cantidad) de cada item
  calcularTotal(): number {
    if (!this.mesa || !this.mesa.pedidoActual || !this.mesa.pedidoActual.items) {
      return 0;
    }
    return this.mesa.pedidoActual.items.reduce((acc: number, item: any) => 
      acc + (item.precioUnitario * item.cantidad), 0);
  }

  procesarPago() {
    const datosPago = {
      montoEntregado: this.montoEntregado,
      metodo: this.metodoPago
    };

    this.apiService.pagar(this.mesaId, datosPago).subscribe({
      next: () => {
        alert('Pago realizado con éxito. La mesa ha sido liberada.');
        this.router.navigate(['/mesas']);
      },
      error: (err) => {
        console.error(err);
        alert('Error al procesar el pago. Verifique que la mesa tenga un pedido activo.');
      }
    });
  }

  // Abre el diálogo de impresión del navegador
  imprimirTicket() {
    window.print();
  }
}