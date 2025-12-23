import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mesa } from '../models/mesa.model';
import { Plato } from '../models/plato.model';
import { Pedido } from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private url = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // ==========================================
  // GESTIÓN DE MESAS
  // ==========================================

  getMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.url}/mesas`); 
  }

  getMesa(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/mesas/${id}`);
  }

  getMesaPorId(id: number): Observable<Mesa> {
    return this.http.get<Mesa>(`${this.url}/mesas/${id}`);
  }

  crearMesa(mesa: any): Observable<Mesa> {
    return this.http.post<Mesa>(`${this.url}/mesas`, mesa);
  }

  eliminarMesa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/mesas/${id}`);
  }

  // NUEVO MÉTODO: Libera la mesa en la BD y cambia su estado a LIBRE
  cobrarMesa(id: number): Observable<Mesa> {
    // Coincide con @PutMapping("/{id}/cobrar") en tu MesaController.java
    return this.http.put<Mesa>(`${this.url}/mesas/${id}/cobrar`, {});
  }

  // ==========================================
  // GESTIÓN DE PLATOS
  // ==========================================

  getPlatos(): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.url}/platos`);
  }

  crearPlato(plato: any): Observable<any> {
    return this.http.post(`${this.url}/platos`, plato);
  }

  actualizarPlato(id: number, plato: any): Observable<any> {
    return this.http.put(`${this.url}/platos/${id}`, plato);
  }

  eliminarPlato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/platos/${id}`);
  }

  // ==========================================
  // GESTIÓN DE PEDIDOS Y COCINA
  // ==========================================

  crearPedido(mesaId: number, pedido: any): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.url}/pedidos/mesa/${mesaId}`, pedido);
  }

  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.url}/pedidos`);
  }

  marcarPedidoListo(id: number): Observable<any> {
    return this.http.put(`${this.url}/pedidos/${id}/listo`, {});
  }

  // ==========================================
  // PAGOS Y REPORTES
  // ==========================================

  pagar(mesaId: number, datos: any): Observable<any> {
    return this.http.post(`${this.url}/pagos/mesa/${mesaId}`, datos);
  }

  getReporteVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/pedidos/reporte/ventas`);
  }

  getResumenEstados(): Observable<any> {
    return this.http.get<any>(`${this.url}/admin/resumen`);
  }
}