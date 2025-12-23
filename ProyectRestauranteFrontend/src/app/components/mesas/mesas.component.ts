import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- CORRIGE EL ERROR NG8002
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-mesas',
  standalone: true, // Asegúrate de que sea standalone si usas imports aquí
  imports: [CommonModule], // <--- ESTO HACE QUE FUNCIONE [ngClass]
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {
  mesas: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.cargarMesas();
  }

  cargarMesas() {
    this.apiService.getMesas().subscribe({
      next: (data) => this.mesas = data,
      error: (err) => console.error('Error al cargar mesas', err)
    });
  }

  // CORRIGE EL ERROR TS2551: Agregamos la función para el botón dorado
  agregarMesa() {
    const numero = prompt('Ingrese el número de la nueva mesa:');
    if (numero) {
      const nuevaMesa = {
        numero: parseInt(numero),
        estado: 'LIBRE',
        color: 'black' // Color inicial para mesas libres
      };

      this.apiService.crearMesa(nuevaMesa).subscribe({
        next: () => {
          alert('Mesa agregada al salón');
          this.cargarMesas(); // Recarga la vista
        },
        error: (err) => alert('Error al crear mesa')
      });
    }
  }

irAlMenu(idMesa: number) {
  console.log("Intentando ir al menú de la mesa ID:", idMesa); // <--- MIRA ESTO EN LA CONSOLA
  
  if (!idMesa) {
    alert("Error: La mesa no tiene un ID válido.");
    return;
  }
  
  this.router.navigate(['/menu', idMesa]); 
}

  cobrarMesa(idMesa: number) {
    if (confirm('¿Deseas cobrar y liberar la mesa?')) {
      this.apiService.cobrarMesa(idMesa).subscribe({
        next: () => {
          alert('Mesa liberada');
          this.cargarMesas();
        },
        error: (err) => console.error('Error al cobrar:', err)
      });
    }
  }

 // En mesas.component.ts

// 1. Agrega esta variable al inicio de tu clase
pedidoSeleccionado: any = null;

// 2. Modifica la función verDetalle
verDetalle(pedido: any) {
  this.pedidoSeleccionado = pedido;
  console.log('Mostrando platos del pedido:', pedido.items); // Para tu referencia en consola
}

// 3. Agrega esta función para limpiar la selección al cerrar
cerrarDetalle() {
  this.pedidoSeleccionado = null;
}
}