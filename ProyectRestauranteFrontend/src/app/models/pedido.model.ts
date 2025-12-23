import { Mesa } from './mesa.model';
import { Plato } from './plato.model';

export interface PedidoItem {
  id?: number;
  plato: Plato;
  cantidad: number;
  precioUnitario: number;
  totalItem: number;
  notas?: string; 
}

export interface Pedido {
  id?: number;
  mesa: Mesa;
  items: PedidoItem[];
  pedidoListo: boolean;
  fechaHoraCreacion?: number;
  fechaHoraListo?: number;
  esExtra: boolean;
}