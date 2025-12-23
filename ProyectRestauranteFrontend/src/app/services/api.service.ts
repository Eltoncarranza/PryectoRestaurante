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

  // Mesas
  getMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.url}/mesas/mesaDe`);
  }

  // Platos
  getPlatos(): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.url}/platos`);
  }

  // Pedidos
  crearPedido(mesaId: number, pedido: any): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.url}/pedidos/mesa/${mesaId}`, pedido);
  }

  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.url}/pedidos`);
  }

  marcarListo(id: number): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.url}/pedidos/${id}/listo`, {});
  }

  crearMesa(mesa: any): Observable<Mesa> {
  return this.http.post<Mesa>(`${this.url}/mesas`, mesa);
}

  eliminarMesa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/mesas/${id}`);
  }

  getMesaPorId(id: number): Observable<Mesa> {
  return this.http.get<Mesa>(`${this.url}/mesas/${id}`);
}
getDetalleCuenta(mesaId: number): Observable<any> {
  return this.http.get<any>(`${this.url}/pedidos/mesa/${mesaId}/cuenta`);
}

pagarCuenta(mesaId: number): Observable<void> {
  return this.http.post<void>(`${this.url}/mesas/${mesaId}/pagar`, {});
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
getReporteVentas(): Observable<any[]> {
  return this.http.get<any[]>(`${this.url}/pedidos/reporte/ventas`);
}
getResumenEstados(): Observable<any> {
  // Retorna conteo de mesas libres/ocupadas y pedidos listos/pendientes
  return this.http.get<any>(`${this.url}/admin/resumen`);
}


marcarPedidoListo(id: number): Observable<any> {
  // El endpoint debe coincidir con el de PedidoController en Java
  return this.http.put(`${this.url}/pedidos/${id}/listo`, {});
}
getMesa(id: number): Observable<any> {
  return this.http.get(`${this.url}/mesas/${id}`);
}

pagar(mesaId: number, datos: any): Observable<any> {
  // Coincide con el endpoint del PagoService en Java
  return this.http.post(`${this.url}/pagos/mesa/${mesaId}`, datos);
}
}