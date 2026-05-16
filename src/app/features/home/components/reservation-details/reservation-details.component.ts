import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmationUtils } from '../../utils/confirmation-utils';
import { ConfirmationDataAccessors } from '../../utils/confirmation-data-accessors';
import { ReservaResponse } from '../../interfaces';

@Component({
  selector: 'app-reservation-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-details.component.html',
})
export class ReservationDetailsComponent {
  reserva = input.required<ReservaResponse>();

  estadoGradient = computed(() => {
    const map: Record<string, string> = {
      CONFIRMADA: 'bg-bosque-900',
      PENDIENTE:  'bg-neutral-800',
      CANCELADA:  'bg-neutral-700',
    };
    return map[this.reserva().estado] ?? 'bg-neutral-800';
  });

  estadoBadge = computed(() => {
    const map: Record<string, string> = {
      CONFIRMADA: 'bg-bosque-50 text-bosque-900 border-bosque-100',
      PENDIENTE:  'bg-amber-50 text-amber-700 border-amber-100',
      CANCELADA:  'bg-neutral-100 text-neutral-600 border-neutral-200',
    };
    return map[this.reserva().estado] ?? 'bg-neutral-100 text-neutral-600 border-neutral-200';
  });

  get hotelNombre(): string {
    return ConfirmationDataAccessors.hotelNombre(this.reserva());
  }

  get hotelDireccion(): string {
    return ConfirmationDataAccessors.hotelDireccion(this.reserva());
  }

  get clienteNombreCompleto(): string {
    return ConfirmationDataAccessors.clienteNombreCompleto(this.reserva());
  }

  get clienteDni(): string {
    return ConfirmationDataAccessors.clienteDni(this.reserva());
  }

  get clienteEmail(): string {
    return ConfirmationDataAccessors.clienteEmail(this.reserva());
  }

  formatDate(dateString: string): string {
    return ConfirmationUtils.formatDate(dateString);
  }

  formatCurrency(amount: number): string {
    return ConfirmationUtils.formatCurrency(amount);
  }

  calcularNoches(): number {
    return ConfirmationUtils.calcularNoches(this.reserva()!);
  }

  getHabitacionInfo(habitacionId: number) {
    return ConfirmationUtils.getHabitacionInfo(habitacionId, this.reserva()?.hotel!);
  }
}
