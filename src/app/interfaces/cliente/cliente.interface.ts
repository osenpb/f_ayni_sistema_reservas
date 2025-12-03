export interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  documento: string; // Este es el DNI que viene del backend
}

export interface ClienteDTO {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
}
