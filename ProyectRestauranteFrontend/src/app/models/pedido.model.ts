import { Mesa } from './mesa.model';
import { Plato } from './plato.model';

export interface PedidoItem {
  id?: number;
  plato?: Plato; // Agregamos '?' porque puede ser opcional si hay error de carga
  cantidad: number;
  precioUnitario: number;
  totalItem: number;
  notas?: string; 
}

export interface Pedido {
  id?: number;
  mesa?: Mesa; // Agregamos '?' para evitar el error 'reading numero'
  items: PedidoItem[];
  pedidoListo: boolean;
  fechaHoraCreacion?: number;
  fechaHoraListo?: number;
  esExtra: boolean;
}