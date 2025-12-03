import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReservaPublicService } from '../../services/reserva-public.service';
import { ReservaCompleta } from '../../interfaces/reserva-public.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-mis-reservas-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './mis-reservas-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisReservasPageComponent {
  private reservaService = inject(ReservaPublicService);
  private http = inject(HttpClient);

  dni = signal<string>('');
  reservas = signal<ReservaCompleta[]>([]);
  loading = signal<boolean>(false);
  buscado = signal<boolean>(false);
  error = signal<string | null>(null);
  mensaje = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Modal eliminar
  showModalEliminar = signal<boolean>(false);
  reservaSeleccionada = signal<ReservaCompleta | null>(null);
  procesando = signal<boolean>(false);

  // Modal editar
  showModalEditar = signal<boolean>(false);
  editFechaInicio = signal<string>('');
  editFechaFin = signal<string>('');
  editError = signal<string | null>(null);

  onDniInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    this.dni.set(value);
    input.value = value;
  }

  buscarReservas(): void {
    const dniValue = this.dni().trim();

    if (!dniValue) {
      this.error.set('Ingrese su número de DNI');
      return;
    }

    if (dniValue.length !== 8) {
      this.error.set('El DNI debe tener 8 dígitos');
      return;
    }

    this.error.set(null);
    this.mensaje.set(null);
    this.successMessage.set(null);
    this.loading.set(true);
    this.buscado.set(false);

    this.reservaService.getMisReservas(dniValue).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.reservas.set(data);
          this.mensaje.set(null);
        } else if ('mensaje' in data) {
          this.reservas.set([]);
          this.mensaje.set(data.mensaje);
        }
        this.buscado.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error buscando reservas:', err);
        this.reservas.set([]);
        this.error.set('Error al buscar reservas. Intente nuevamente.');
        this.buscado.set(true);
        this.loading.set(false);
      },
    });
  }

  limpiarBusqueda(): void {
    this.dni.set('');
    this.reservas.set([]);
    this.buscado.set(false);
    this.error.set(null);
    this.mensaje.set(null);
    this.successMessage.set(null);
  }

  // === MODAL ELIMINAR ===
  abrirModalEliminar(reserva: ReservaCompleta): void {
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

    this.http.delete(`http://localhost:8080/api/public/reserva/${reserva.id}`).subscribe({
      next: () => {
        this.procesando.set(false);
        this.cerrarModalEliminar();
        this.successMessage.set(`Reserva #${reserva.id} cancelada exitosamente`);
        this.buscarReservas();
      },
      error: (err) => {
        console.error('Error cancelando reserva:', err);
        this.procesando.set(false);
        this.cerrarModalEliminar();
        this.error.set('Error al cancelar la reserva. Intente nuevamente.');
      },
    });
  }

  // === MODAL EDITAR ===
  abrirModalEditar(reserva: ReservaCompleta): void {
    this.reservaSeleccionada.set(reserva);
    this.editFechaInicio.set(reserva.fechaInicio);
    this.editFechaFin.set(reserva.fechaFin);
    this.editError.set(null);
    this.showModalEditar.set(true);
  }

  cerrarModalEditar(): void {
    this.showModalEditar.set(false);
    this.reservaSeleccionada.set(null);
    this.editError.set(null);
  }

  onEditFechaInicioChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.editFechaInicio.set(input.value);
  }

  onEditFechaFinChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.editFechaFin.set(input.value);
  }

  calcularNochesEdit(): number {
    const inicio = new Date(this.editFechaInicio());
    const fin = new Date(this.editFechaFin());
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return 0;
    const diff = fin.getTime() - inicio.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  confirmarEditar(): void {
    const reserva = this.reservaSeleccionada();
    if (!reserva) return;

    const fechaInicio = this.editFechaInicio();
    const fechaFin = this.editFechaFin();

    if (!fechaInicio || !fechaFin) {
      this.editError.set('Las fechas son obligatorias');
      return;
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (inicio < hoy) {
      this.editError.set('La fecha de entrada no puede ser anterior a hoy');
      return;
    }

    if (fin <= inicio) {
      this.editError.set('La fecha de salida debe ser posterior a la de entrada');
      return;
    }

    this.procesando.set(true);
    this.editError.set(null);

    this.http
      .put(`http://localhost:8080/api/public/reserva/${reserva.id}`, {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
      })
      .subscribe({
        next: () => {
          this.procesando.set(false);
          this.cerrarModalEditar();
          this.successMessage.set(`Reserva #${reserva.id} actualizada exitosamente`);
          this.buscarReservas();
        },
        error: (err) => {
          console.error('Error actualizando reserva:', err);
          this.procesando.set(false);
          this.editError.set(err.error?.message || 'Error al actualizar la reserva');
        },
      });
  }

  // === UTILIDADES ===
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatDateLong(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  formatCurrency(amount: number): string {
    return `S/ ${amount.toFixed(2)}`;
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'CONFIRMADA':
        return 'bg-green-100 text-green-800';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  calcularNoches(fechaInicio: string, fechaFin: string): number {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diff = fin.getTime() - inicio.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
