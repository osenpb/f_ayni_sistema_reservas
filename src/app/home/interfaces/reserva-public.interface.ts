export interface ClienteRequest {
  dni: string;
  nombre: string;
  apellido: string;
  correo: string;
}

export interface ReservaRequest {
  fechaInicio: string;
  fechaFin: string;
  habitacionesIds: number[];
  cliente: ClienteRequest;
}

export interface ReservaResponse {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  total: number;
  estado: string;
  habitaciones: string[];
}

export interface ReservaDetalleResponse {
  id: number;
  fechaReserva: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  total: number;
  cliente: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
  };
  hotel: {
    id: number;
    nombre: string;
    direccion: string;
  };
  habitaciones: {
    numero: string;
    tipo: string;
    precioNoche: number;
  }[];
}

export interface MisReservasResponse {
  dni: string;
  reservas: {
    id: number;
    fechaReserva: string;
    fechaInicio: string;
    fechaFin: string;
    estado: string;
    total: number;
    hotel: string;
    habitaciones: number;
  }[];
}
