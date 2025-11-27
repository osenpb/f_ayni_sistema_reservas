export interface TipoHabitacionPublic {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
}

export interface HabitacionPublic {
  id: number;
  numero: string;
  estado: 'DISPONIBLE' | 'OCUPADA' | 'MANTENIMIENTO';
  precio: number;
  tipoHabitacion: TipoHabitacionPublic;
  hotelId: number;
}

export interface HabitacionesDisponiblesResponse {
  hotelId: number;
  hotelNombre: string;
  fechaInicio: string;
  fechaFin: string;
  habitacionesDisponibles: HabitacionPublic[];
  cantidad: number;
}
