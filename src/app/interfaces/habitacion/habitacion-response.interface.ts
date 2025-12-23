import { TipoHabitacionResponse } from '../tipo-habitacion/tipo-habitacion-response.interface';

/**
 * Estados posibles de una habitación
 */
export type EstadoHabitacion = 'DISPONIBLE' | 'OCUPADA' | 'MANTENIMIENTO';

/**
 * DTO de respuesta de habitación - Coincide con backend HabitacionResponse.java
 */
export interface HabitacionResponse {
  id: number;
  numero: string;
  estado: EstadoHabitacion;
  precio: number;
  tipoHabitacion: TipoHabitacionResponse;
  hotelId: number;
}

/**
 * DTO para habitaciones disponibles - Coincide con backend HabitacionesDisponiblesResponse.java
 */
export interface HabitacionesDisponiblesResponse {
  hotelId: number;
  hotelNombre: string;
  fechaInicio: string;
  fechaFin: string;
  habitacionesDisponibles: HabitacionResponse[];
  cantidad: number;
}
