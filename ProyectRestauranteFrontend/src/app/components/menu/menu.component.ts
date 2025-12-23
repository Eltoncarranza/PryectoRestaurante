import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Plato } from '../../models/plato.model';
import { Mesa } from '../../models/mesa.model';

// Definimos una interfaz clara para los elementos del carrito
interface ItemCarrito {
  plato: Plato;
  cantidad: number;
  precioUnitario: number;
  totalItem: number;
  notas: string;
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
    const id = Number(this.route.snapshot.paramMap.get('idMesa'));
    this.idMesa = id; 

    // 1. Carga de datos de la mesa (Sincronizado con ApiService.getMesa)
    this.apiService.getMesa(id).subscribe({
      next: (mesa: any) => {
        this.mesaSeleccionada = mesa;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al obtener la mesa', err);
        this.cargando = false;
        alert('No se pudo cargar la información de la mesa.');
      }
    });

    // 2. Carga del catálogo de platos
    this.apiService.getPlatos().subscribe({
      next: (data: any) => {
        this.platos = data;
      },
      error: (err: any) => {
        console.error('Error al cargar platos', err);
      }
    });
  }

  // Cálculo preciso del total acumulado
  get totalPedido(): number {
    return this.carrito.reduce((acc, item) => acc + item.totalItem, 0);
  }

  agregarAlCarrito(plato: Plato): void {
    const itemExistente = this.carrito.find(item => item.plato.id === plato.id);

    if (itemExistente) {
      itemExistente.cantidad++;
      itemExistente.totalItem = itemExistente.cantidad * itemExistente.precioUnitario;
    } else {
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
    if (this.carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

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
      error: (err: any) => {
        console.error('Error al enviar pedido', err);
        alert('Error al procesar el pedido. Intente de nuevo.');
      }
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