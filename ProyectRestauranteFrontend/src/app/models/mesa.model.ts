export enum MesaEstado {
    LIBRE = 'LIBRE',
    OCUPADA = 'OCUPADA',
    ESPERANDO_COMIDA = 'ESPERANDO_COMIDA',
    PAGANDO = 'PAGANDO'
}

export interface Mesa {
    id: number;
    numero: number;
    estado: MesaEstado;
    color: string;
    tiempoInicioEstado?: number;
}