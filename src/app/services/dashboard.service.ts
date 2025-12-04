import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface DashboardStats {
  totalDepartamentos: number;
  totalHoteles: number;
  totalHabitaciones: number;
  totalReservas: number;
  reservasPorEstado: { [key: string]: number };
  ingresosTotales: number;
  hotelesPorDepartamento: { [key: string]: number };
  reservasPorMes: { [key: string]: number };
  ingresosPorMes: { [key: string]: number };
  topHoteles: { nombre: string; reservas: number }[];
  reservasRecientes: {
    id: number;
    cliente: string;
    hotel: string;
    fechaInicio: string;
    fechaFin: string;
    total: number;
    estado: string;
  }[];
}

const baseUrl = 'http://localhost:8080/api/admin/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${baseUrl}/stats`).pipe(
      catchError((error: any) => {
        console.error('Error al obtener estadísticas:', error);
        return throwError(() => error);
      })
    );
  }
}
