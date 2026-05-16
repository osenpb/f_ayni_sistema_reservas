import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservaListResponse, ReservaUpdateRequest } from '../../../../interfaces';

@Component({
  selector: 'app-edit-reserva-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-reserva-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditReservaModalComponent {
  reserva = input.required<ReservaListResponse>();
  procesando = input.required<boolean>();

  confirmar = output<ReservaUpdateRequest>();
  cerrar = output<void>();

  editFechaInicio = signal('');
  editFechaFin = signal('');
  editError = signal<string | null>(null);

  constructor() {
    effect(() => {
      const r = this.reserva();
      this.editFechaInicio.set(r.fechaInicio);
      this.editFechaFin.set(r.fechaFin);
      this.editError.set(null);
    });
  }

  onFechaInicioChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.editFechaInicio.set(input.value);
  }

  onFechaFinChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.editFechaFin.set(input.value);
  }

  getMinDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  calcularNoches(): number {
    if (!this.editFechaInicio() || !this.editFechaFin()) return 0;
    const [y1, m1, d1] = this.editFechaInicio().split('-').map(Number);
    const [y2, m2, d2] = this.editFechaFin().split('-').map(Number);
    const inicio = new Date(y1, m1 - 1, d1);
    const fin = new Date(y2, m2 - 1, d2);
    return Math.max(0, Math.round((fin.getTime() - inicio.getTime()) / 86400000));
  }

  submit(): void {
    const fechaInicio = this.editFechaInicio();
    const fechaFin = this.editFechaFin();

    if (!fechaInicio || !fechaFin) {
      this.editError.set('Las fechas son obligatorias');
      return;
    }

    const mananaISO = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    ).toISOString().split('T')[0];

    if (fechaInicio < mananaISO) {
      this.editError.set('Las reservas deben realizarse con al menos 24 horas de anticipación');
      return;
    }

    if (fechaFin <= fechaInicio) {
      this.editError.set('La fecha de salida debe ser posterior a la de entrada');
      return;
    }

    this.editError.set(null);
    this.confirmar.emit({ fechaInicio, fechaFin });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
