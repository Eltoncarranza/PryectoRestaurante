import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Plato } from '../../models/plato.model';
import { Mesa } from '../../models/mesa.model';

interface ItemCarrito {
  plato: Plato;
  cantidad: number;
  precioUnitario: number;
  totalItem: number;
  notas: string; // CAMBIADO: Volvemos a 'notas' para que coincida con tu HTML
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  idMesa!: number;
  platos: Plato[] = [];
  carrito: ItemCarrito[] = []; 
  mesaSeleccionada?: Mesa;
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('idMesa');
    if (idParam) {
      this.idMesa = Number(idParam);
      this.cargarDatos();
    } else {
      this.router.navigate(['/mesas']);
    }
  }

  private cargarDatos(): void {
    this.apiService.getMesa(this.idMesa).subscribe({
      next: (mesa: Mesa) => {
        this.mesaSeleccionada = mesa;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.router.navigate(['/mesas']);
      }
    });

    this.apiService.getPlatos().subscribe({
      next: (data) => this.platos = data,
      error: (err) => console.error('Error al cargar platos', err)
    });
  }

  get totalPedido(): number {
    return this.carrito.reduce((acc, item) => acc + item.totalItem, 0);
  }

  agregarAlCarrito(plato: Plato): void {
    const itemExistente = this.carrito.find(item => item.plato.id === plato.id);

    if (itemExistente) {
      itemExistente.cantidad++;
      itemExistente.totalItem = itemExistente.cantidad * itemExistente.precioUnitario;
    } else {
      const notaEspecial = prompt(`¿Alguna especificación para ${plato.nombre}?`);
      this.carrito.push({
        plato: plato,
        cantidad: 1,
        precioUnitario: plato.precio,
        totalItem: plato.precio,
        notas: notaEspecial || '' // Usamos 'notas' aquí también
      });
    }
  }

  // SOLUCIÓN AL ERROR TS2339: Agregamos la función que faltaba
  vaciarCarrito(): void {
    if (confirm('¿Deseas borrar toda la orden actual?')) {
      this.carrito = [];
    }
  }

  enviarPedidoFinal(): void {
    if (this.carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    const pedidoData = {
      items: this.carrito.map(item => ({
        plato: { id: item.plato.id }, 
        cantidad: item.cantidad,
        notas: item.notas, // Enviamos 'notas' al servidor
        precioUnitario: item.precioUnitario
      })),
      esExtra: false
    };

    this.apiService.crearPedido(this.idMesa, pedidoData).subscribe({
      next: () => {
        alert('¡Pedido enviado con éxito!');
        this.router.navigate(['/mesas']);
      },
      error: (err) => alert('Error al procesar el pedido.')
    });
  }

  cambiarCantidad(index: number, delta: number): void {
    const item = this.carrito[index];
    item.cantidad += delta;
    if (item.cantidad <= 0) this.quitarDelCarrito(index);
    else item.totalItem = item.cantidad * item.precioUnitario;
  }

  quitarDelCarrito(index: number): void {
    this.carrito.splice(index, 1);
  }
}