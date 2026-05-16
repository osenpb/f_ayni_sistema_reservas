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
      CONFIRMADA: 'bg-linear-to-r from-green-600 to-green-700',
      PENDIENTE:  'bg-linear-to-r from-yellow-500 to-yellow-600',
      CANCELADA:  'bg-linear-to-r from-gray-500 to-gray-600',
    };
    return map[this.reserva().estado] ?? 'bg-linear-to-r from-gray-500 to-gray-600';
  });

  estadoBadge = computed(() => {
    const map: Record<string, string> = {
      CONFIRMADA: 'bg-green-100 text-green-700',
      PENDIENTE:  'bg-yellow-100 text-yellow-700',
      CANCELADA:  'bg-red-100 text-red-700',
    };
    return map[this.reserva().estado] ?? 'bg-gray-100 text-gray-700';
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
