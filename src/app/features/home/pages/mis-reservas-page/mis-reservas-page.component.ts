import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { ReservaPublicService } from '../../../../services/reserva-public.service';
import { ReservaListResponse, ReservaUpdateRequest } from '../../../../interfaces';
import { LoggerService } from '../../../../core/services/logger.service';
import { CurrencySolPipe } from '../../../../shared/pipes/currency-sol.pipe';
import { EstadoBadgePipe } from '../../../../shared/pipes/estado-badge.pipe';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';
import { EditReservaModalComponent } from '../../components/edit-reserva-modal/edit-reserva-modal.component';

@Component({
  standalone: true,
  selector: 'app-mis-reservas-page',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CurrencySolPipe,
    EstadoBadgePipe,
    FormatDatePipe,
    EditReservaModalComponent,
  ],
  templateUrl: './mis-reservas-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisReservasPageComponent implements OnInit {
  private reservaService = inject(ReservaPublicService);
  private router = inject(Router);
  private logger = inject(LoggerService);

  reservas = signal<ReservaListResponse[]>([]);
  reservasFiltradas = signal<ReservaListResponse[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  filtroFechaInicio = signal<string>('');
  filtroFechaFin = signal<string>('');
  filtroEstado = signal<string>('TODOS');

  showModalEliminar = signal<boolean>(false);
  reservaSeleccionada = signal<ReservaListResponse | null>(null);
  procesando = signal<boolean>(false);

  showModalEditar = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.loading.set(true);
    this.error.set(null);

    const fechaInicio = this.filtroFechaInicio() || undefined;
    const fechaFin = this.filtroFechaFin() || undefined;

    this.reservaService.getMisReservas(fechaInicio, fechaFin).subscribe({
      next: (data) => {
        this.logger.log(data);
        if (Array.isArray(data)) {
          this.reservas.set(data);
          this.aplicarFiltros();
        } else {
          this.reservas.set([]);
          this.reservasFiltradas.set([]);
        }
        this.loading.set(false);
      },
      error: (err: any) => {
        this.logger.error('Error cargando reservas:', err);
        if (err.status === 401) {
          this.error.set('Debe iniciar sesión para ver sus reservas');
        } else {
          this.error.set('Error al cargar sus reservas. Intente nuevamente.');
        }
        this.reservas.set([]);
        this.reservasFiltradas.set([]);
        this.loading.set(false);
      },
    });
  }

  aplicarFiltros(): void {
    let resultado = this.reservas();
    const estado = this.filtroEstado();
    if (estado !== 'TODOS') {
      resultado = resultado.filter((r) => r.estado === estado);
    }
    this.reservasFiltradas.set(resultado);
  }

  onFiltroFechaInicioChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtroFechaInicio.set(input.value);
  }

  onFiltroFechaFinChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtroFechaFin.set(input.value);
  }

  onFiltroEstadoChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filtroEstado.set(select.value);
    this.aplicarFiltros();
  }

  buscarConFiltros(): void {
    this.cargarReservas();
  }

  limpiarFiltros(): void {
    this.filtroFechaInicio.set('');
    this.filtroFechaFin.set('');
    this.filtroEstado.set('TODOS');
    this.cargarReservas();
  }

  // === MODAL ELIMINAR ===
  abrirModalEliminar(reserva: ReservaListResponse): void {
    this.reservaSeleccionada.set(reserva);
    this.showModalEliminar.set(true);
  }

  cerrarModalEliminar(): void {
    this.showModalEliminar.set(false);
    this.reservaSeleccionada.set(null);
  }

  confirmarEliminar(): void {
    const reserva = this.reservaSeleccionada();
    if (!reserva) return;

    this.procesando.set(true);

    this.reservaService.cancelarReserva(reserva.id).subscribe({
      next: () => {
        this.procesando.set(false);
        this.cerrarModalEliminar();
        this.successMessage.set(`Reserva #${reserva.id} cancelada exitosamente`);
        this.cargarReservas();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: any) => {
        this.logger.error('Error cancelando reserva:', err);
        this.procesando.set(false);
        this.cerrarModalEliminar();
        if (err.status === 403) {
          this.error.set('No tiene permiso para cancelar esta reserva');
        } else {
          this.error.set('Error al cancelar la reserva. Intente nuevamente.');
        }
      },
    });
  }

  // === MODAL EDITAR ===
  abrirModalEditar(reserva: ReservaListResponse): void {
    this.reservaSeleccionada.set(reserva);
    this.showModalEditar.set(true);
  }

  cerrarModalEditar(): void {
    this.showModalEditar.set(false);
    this.reservaSeleccionada.set(null);
  }

  confirmarEditar(request: ReservaUpdateRequest): void {
    const reserva = this.reservaSeleccionada();
    if (!reserva) return;

    this.procesando.set(true);

    this.reservaService.actualizarReserva(reserva.id, request).subscribe({
      next: () => {
        this.procesando.set(false);
        this.cerrarModalEditar();
        this.successMessage.set(`Reserva #${reserva.id} actualizada exitosamente`);
        this.cargarReservas();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: any) => {
        this.logger.error('Error actualizando reserva:', err);
        this.procesando.set(false);
        if (err.status === 403) {
          this.error.set('No tiene permiso para actualizar esta reserva');
        } else {
          this.error.set(err.error?.message || 'Error al actualizar la reserva');
        }
      },
    });
  }

  calcularNoches(fechaInicio: string, fechaFin: string): number {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
  }
}
