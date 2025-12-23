import { HabitacionRequest } from '../habitacion/habitacion-request.interface';

/**
 * DTO de request para crear/actualizar hotel - Coincide con backend HotelRequest.java
 */
export interface HotelRequest {
  nombre: string;
  direccion: string;
  departamentoId: number;
  habitaciones?: HabitacionRequest[];
  imagenUrl?: string;
}
