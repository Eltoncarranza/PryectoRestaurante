import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Plato } from '../../models/plato.model';
import { Mesa } from '../../models/mesa.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  idMesa!: number;
  platos: Plato[] = [];
  carrito: any[] = []; 
  mesaSeleccionada?: Mesa;
  cargando: boolean = true; // Control de estado para evitar el "Cargando..." infinito

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('idMesa'));
    this.idMesa = id; 

    // Mejora: Traer la mesa específica directamente
    this.apiService.getMesaPorId(id).subscribe({
      next: (mesa) => {
        this.mesaSeleccionada = mesa;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener la mesa', err);
        this.cargando = false;
      }
    });

    // Cargar el catálogo de platos
    this.apiService.getPlatos().subscribe(data => {
      this.platos = data;
    });
  }

  // Objetivo SMART: Precisión en el cálculo total
  get totalPedido(): number {
    return this.carrito.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
  }

  agregarAlCarrito(plato: Plato): void {
    // Verificar si el plato ya está en el carrito
    const itemExistente = this.carrito.find(item => item.plato.id === plato.id);

    if (itemExistente) {
      // Si existe, solo aumentamos la cantidad
      itemExistente.cantidad++;
      itemExistente.totalItem = itemExistente.cantidad * itemExistente.precioUnitario;
    } else {
      // Si no existe, lo agregamos con nota opcional
      const notaEspecial = prompt(`¿Alguna especificación para ${plato.nombre}? (Opcional)`);
      
      this.carrito.push({
        plato: plato,
        cantidad: 1,
        precioUnitario: plato.precio,
        totalItem: plato.precio,
        notas: notaEspecial || '' 
      });
    }
  }

  // Permite ajustar cantidades directamente en el resumen
  cambiarCantidad(index: number, delta: number): void {
    const item = this.carrito[index];
    item.cantidad += delta;
    
    if (item.cantidad <= 0) {
      this.quitarDelCarrito(index);
    } else {
      item.totalItem = item.cantidad * item.precioUnitario;
    }
  }

  enviarPedidoFinal(): void {
    if (this.carrito.length === 0) return;

    // Estructura de datos limpia para el Backend
    const pedidoData = {
      items: this.carrito.map(item => ({
        platoId: item.plato.id,
        cantidad: item.cantidad,
        notas: item.notas,
        precioUnitario: item.precioUnitario
      })),
      esExtra: false
    };

    this.apiService.crearPedido(this.idMesa, pedidoData).subscribe({
      next: () => {
        alert('¡Pedido enviado! La cocina ha recibido la comanda.');
        this.router.navigate(['/mesas']);
      },
      error: (err) => alert('Error al procesar el pedido. Intente de nuevo.')
    });
  }

  quitarDelCarrito(index: number): void {
    this.carrito.splice(index, 1);
  }

  vaciarCarrito(): void {
    if (confirm('¿Deseas borrar toda la orden actual?')) {
      this.carrito = [];
    }
  }
}