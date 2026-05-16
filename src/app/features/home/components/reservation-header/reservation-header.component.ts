import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaResponse } from '../../interfaces';

@Component({
  selector: 'app-reservation-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center mb-8">

      <!-- CONFIRMADA -->
      @if (reserva().estado === 'CONFIRMADA') {
        <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-3xl font-serif text-slate-800 mb-2">¡Reserva Confirmada!</h1>
        <p class="text-gray-500">Tu pago ha sido procesado exitosamente</p>
      }

      <!-- PENDIENTE -->
      @if (reserva().estado === 'PENDIENTE') {
        <div class="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
          <svg class="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-3xl font-serif text-slate-800 mb-2">Reserva Pendiente de Pago</h1>
        <p class="text-gray-500">Completa el pago para confirmar tu reserva</p>
      }

      <!-- CANCELADA -->
      @if (reserva().estado === 'CANCELADA') {
        <div class="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
          <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 class="text-3xl font-serif text-slate-800 mb-2">Reserva Cancelada</h1>
        <p class="text-gray-500">Esta reserva ha sido cancelada</p>
      }

    </div>

    <!-- Número de reserva -->
    <div
      class="rounded-lg p-4 mb-6 text-center border"
      [ngClass]="[estadoConfig().bg, estadoConfig().border]"
    >
      <p class="text-sm mb-1" [ngClass]="estadoConfig().text">
        Número de Reserva
      </p>
      <p class="text-2xl font-bold" [ngClass]="estadoConfig().textBold">
        {{ reserva().id.toString().padStart(6, '0') }}
      </p>
    </div>
  `,
})
export class ReservationHeaderComponent {
  readonly reserva = input.required<ReservaResponse>();

  estadoConfig = computed(() => {
    const configs: Record<string, { bg: string; border: string; text: string; textBold: string }> = {
      CONFIRMADA: { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-600',  textBold: 'text-green-700' },
      PENDIENTE:  { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', textBold: 'text-yellow-700' },
      CANCELADA:  { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-600',    textBold: 'text-red-700' },
    };
    return configs[this.reserva().estado] ?? { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', textBold: 'text-gray-700' };
  });
}


