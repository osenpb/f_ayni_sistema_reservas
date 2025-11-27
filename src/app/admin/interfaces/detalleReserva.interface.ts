import { Habitacion } from './habitacion.interface';

export interface DetalleReserva {
  id?: number;
  precioNoche: number;
  habitacion: Habitacion;
}
