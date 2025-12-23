import { DepartamentoResponse } from '../departamento/departamento-response.interface';
import { HabitacionResponse } from '../habitacion/habitacion-response.interface';

/**
 * DTO de respuesta de hotel - Coincide con backend HotelResponse.java
 */
export interface HotelResponse {
  id: number;
  nombre: string;
  direccion: string;
  departamento: DepartamentoResponse;
  habitaciones: HabitacionResponse[];
  imagenUrl: string | null;
}

/**
 * Información básica del hotel para detalle - Coincide con backend HotelDetalleResponse.HotelInfo
 */
export interface HotelInfo {
  id: number;
  nombre: string;
  direccion: string;
  precioMinimo: number;
  cantidadHabitaciones: number;
}

/**
 * DTO de detalle completo de hotel - Coincide con backend HotelDetalleResponse.java
 */
export interface HotelDetalleResponse {
  hotel: HotelInfo;
  departamento: DepartamentoResponse;
  habitaciones: HabitacionResponse[];
}

/**
 * DTO de hoteles con departamento - Coincide con backend HotelesConDepartamentoResponse.java
 */
export interface HotelesConDepartamentoResponse {
  departamento: DepartamentoResponse;
  hoteles: HotelResponse[];
}
