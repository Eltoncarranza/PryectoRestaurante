import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Plato } from '../../../models/plato.model';

@Component({
  selector: 'app-admin-platos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-platos.component.html'
})
export class AdminPlatosComponent implements OnInit {
  platos: Plato[] = [];
  platoForm: Partial<Plato> = { disponible: true };
  editando: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarPlatos();
  }

  cargarPlatos() {
    this.apiService.getPlatos().subscribe(data => this.platos = data);
  }

  guardarPlato() {
    if (this.editando && this.platoForm.id) {
      this.apiService.actualizarPlato(this.platoForm.id, this.platoForm as Plato).subscribe(() => {
        alert('Plato actualizado');
        this.resetForm();
      });
    } else {
      this.apiService.crearPlato(this.platoForm as Plato).subscribe(() => {
        alert('Plato creado');
        this.resetForm();
      });
    }
  }

  prepararEdicion(plato: Plato) {
    this.platoForm = { ...plato };
    this.editando = true;
  }

  eliminar(id: number) {
    if(confirm('¿Eliminar este plato definitivamente?')) {
      this.apiService.eliminarPlato(id).subscribe(() => this.cargarPlatos());
    }
  }

  resetForm() {
    this.platoForm = { disponible: true };
    this.editando = false;
    this.cargarPlatos();
  }
}