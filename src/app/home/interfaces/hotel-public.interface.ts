import { HabitacionPublic } from './habitacion-public.interface';

export interface HotelPublic {
  id: number;
  nombre: string;
  direccion: string;
  precioMinimo?: number;
  cantidadHabitaciones?: number;
}

export interface HotelDetailResponse {
  hotel: {
    id: number;
    nombre: string;
    direccion: string;
    precioMinimo: number;
    cantidadHabitaciones: number;
  };
  departamento: {
    id: number;
    nombre: string;
    detalle: string;
  };
  habitaciones: HabitacionPublic[];
}

export interface HotelesResponse {
  departamento: {
    id: number;
    nombre: string;
    detalle: string;
  };
  hoteles: HotelPublic[];
}
