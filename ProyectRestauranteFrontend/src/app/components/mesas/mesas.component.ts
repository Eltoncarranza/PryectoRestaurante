import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Mesa, MesaEstado } from '../../models/mesa.model';
import { interval, Subscription } from 'rxjs'; 
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit, OnDestroy {
  mesas: Mesa[] = [];
  cargando: boolean = true;
  private refreshSubscription?: Subscription; 

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.refreshSubscription = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.apiService.getMesas())
      )
      .subscribe({
        next: (data: any) => {
          this.mesas = data;
          this.cargando = false;
        },
        error: (err: any) => {
          console.error('Error al conectar con Spring Boot', err);
          this.cargando = false;
        }
      });
  }

  agregarNuevaMesa(): void {
    const proximoNumero = this.mesas.length > 0 
      ? Math.max(...this.mesas.map(m => m.numero)) + 1 
      : 1;

    const nuevaMesa: Partial<Mesa> = {
      numero: proximoNumero,
      estado: MesaEstado.LIBRE
    };

    this.apiService.crearMesa(nuevaMesa).subscribe({
      next: () => console.log('Mesa creada'),
      error: (err: any) => console.error('Error al crear mesa', err)
    });
  }

  quitarMesa(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Desea eliminar esta mesa?')) {
      this.apiService.eliminarMesa(id).subscribe({
        next: () => console.log('Mesa eliminada'),
        error: (err: any) => alert('No se pudo eliminar.')
      });
    }
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }
}