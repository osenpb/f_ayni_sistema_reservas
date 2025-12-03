import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DepartamentoPublic } from '../interfaces/departamento-public.interface';
import { HotelesResponse, HotelDetailResponse } from '../interfaces/hotel-public.interface';
import { HabitacionesDisponiblesResponse } from '../interfaces/habitacion-public.interface';
import {
  ReservaRequest,
  ReservaResponse,
  ReservaDetalleResponse,
  MisReservasResponse,
} from '../interfaces/reserva-public.interface';

const baseUrl = 'http://localhost:8080/api/public';

@Injectable({
  providedIn: 'root',
})
export class ReservaPublicService {
  private http = inject(HttpClient);

  // Departamentos
  getDepartamentos(nombre?: string): Observable<DepartamentoPublic[]> {
    const url = nombre
      ? `${baseUrl}/reserva/departamentos?nombre=${encodeURIComponent(nombre)}`
      : `${baseUrl}/reserva/departamentos`;

    return this.http.get<DepartamentoPublic[]>(url).pipe(
      catchError((error: any) => {
        console.error('Error al obtener departamentos:', error);
        return throwError(() => error);
      })
    );
  }

  // Hoteles por departamento
  getHotelesPorDepartamento(depId: number): Observable<HotelesResponse> {
    return this.http.get<HotelesResponse>(`${baseUrl}/reserva/hoteles?depId=${depId}`).pipe(
      catchError((error: any) => {
        console.error('Error al obtener hoteles:', error);
        return throwError(() => error);
      })
    );
  }

  // Detalle de hotel
  getHotelDetalle(hotelId: number): Observable<HotelDetailResponse> {
    return this.http.get<HotelDetailResponse>(`${baseUrl}/reserva/hoteles/${hotelId}`).pipe(
      catchError((error: any) => {
        console.error('Error al obtener detalle del hotel:', error);
        return throwError(() => error);
      })
    );
  }

  // Habitaciones disponibles por fechas
  getHabitacionesDisponibles(
    hotelId: number,
    fechaInicio: string,
    fechaFin: string
  ): Observable<HabitacionesDisponiblesResponse> {
    return this.http
      .get<HabitacionesDisponiblesResponse>(
        `${baseUrl}/reserva/hoteles/${hotelId}/habitaciones-disponibles?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      )
      .pipe(
        catchError((error: any) => {
          console.error('Error al obtener habitaciones disponibles:', error);
          return throwError(() => error);
        })
      );
  }

  // Crear reserva
  crearReserva(hotelId: number, reserva: ReservaRequest): Observable<ReservaResponse> {
    return this.http
      .post<ReservaResponse>(`${baseUrl}/reserva/hoteles/${hotelId}/reservar`, reserva)
      .pipe(
        catchError((error: any) => {
          console.error('Error al crear reserva:', error);
          return throwError(() => error);
        })
      );
  }

  // Obtener detalle de reserva
  getReservaDetalle(reservaId: number): Observable<ReservaDetalleResponse> {
    return this.http.get<ReservaDetalleResponse>(`${baseUrl}/reserva/reserva/${reservaId}`).pipe(
      catchError((error: any) => {
        console.error('Error al obtener detalle de reserva:', error);
        return throwError(() => error);
      })
    );
  }

  // Buscar mis reservas por DNI
  getMisReservas(dni: string): Observable<MisReservasResponse> {
    return this.http.get<MisReservasResponse>(`${baseUrl}/reserva/mis-reservas?dni=${dni}`).pipe(
      catchError((error: any) => {
        console.error('Error al buscar reservas:', error);
        return throwError(() => error);
      })
    );
  }
}
