import { Cliente } from './cliente.interface';
import { Hotel } from './hotel.interface';
import { DetalleReserva } from './detalleReserva.interface';

export interface Reserva {
  id: number;
  fechaReserva: string;
  fechaInicio: string;
  fechaFin: string;
  total: number;
  estado: 'CONFIRMADA' | 'CANCELADA';
  cliente: Cliente;
  hotel: Hotel;
  detalles: DetalleReserva[];
}

export interface ReservaAdminUpdateDTO {
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  hotelId: number;
  cliente: {
    dni: string;
    nombre: string;
    apellido: string;
    correo: string;
  };
  habitaciones: number[];
}
