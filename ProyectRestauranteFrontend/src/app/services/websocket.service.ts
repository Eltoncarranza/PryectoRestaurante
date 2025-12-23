import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;
  private nuevoPedidoSubject = new Subject<any>();

  constructor() {
    this.client = new Client({
      // Esta URL debe coincidir con la configuración de tu Backend (Spring Boot)
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-restaurante'),
      debug: (msg) => console.log('WS Debug:', msg),
      reconnectDelay: 5000, // Intenta reconectar cada 5 segundos si se cae
    });

    this.client.onConnect = (frame) => {
      console.log('Conectado al WebSocket exitosamente');
      
      // Suscribirse al canal de pedidos
      this.client.subscribe('/topic/pedidos', (message: Message) => {
        if (message.body) {
          this.nuevoPedidoSubject.next(JSON.parse(message.body));
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error('Error de STOMP:', frame.headers['message']);
    };

    this.client.activate();
  }

  // Método para que los componentes se suscriban a las notificaciones
  getNotificacionesPedidos(): Observable<any> {
    return this.nuevoPedidoSubject.asObservable();
  }
}