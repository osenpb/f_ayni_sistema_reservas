import { EstadoHabitacion } from './habitacion-response.interface';

/**
 * DTO de request para crear/actualizar habitación - Coincide con backend HabitacionRequest.java
 */
export interface HabitacionRequest {
  numero: string;
  estado: EstadoHabitacion;
  precio: number;
  tipoHabitacionId: number;
}
