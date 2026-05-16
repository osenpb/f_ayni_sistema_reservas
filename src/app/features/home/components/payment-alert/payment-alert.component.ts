import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservaResponse } from '../../interfaces';

@Component({
  selector: 'app-payment-alert',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (reserva().estado === 'PENDIENTE') {
    <div class="bg-amber-50 border border-amber-100 rounded-xl p-5">
      <div class="flex items-start gap-3 mb-4">
        <svg class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <div>
          <p class="text-sm font-semibold text-amber-800">Pago pendiente</p>
          <p class="text-sm text-amber-700 mt-0.5">Tu reserva no está confirmada hasta que completes el pago.</p>
        </div>
      </div>
      <a [routerLink]="['/home/reserva', reserva().id, 'pago']"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-bosque-900 hover:bg-bosque-800 text-white text-sm font-semibold rounded-lg transition-all active:scale-[0.97]">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
        </svg>
        Completar Pago
      </a>
    </div>
    }
  `,
})
export class PaymentAlertComponent {
  reserva = input.required<Pick<ReservaResponse, 'id' | 'estado'>>();
}
