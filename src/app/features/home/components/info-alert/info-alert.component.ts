import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoReserva } from '../../interfaces';

@Component({
  selector: 'app-info-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (estado() !== 'CANCELADA') {
    <div class="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
      <div class="flex gap-3">
        <svg class="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div>
          <p class="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.1em] mb-2">Información importante</p>
          <ul class="space-y-1.5 text-sm text-neutral-600">
            <li class="flex items-start gap-2">
              <span class="w-1 h-1 rounded-full bg-neutral-400 shrink-0 mt-2"></span>
              Presente este comprobante al momento del check-in
            </li>
            <li class="flex items-start gap-2">
              <span class="w-1 h-1 rounded-full bg-neutral-400 shrink-0 mt-2"></span>
              Se requiere documento de identidad original
            </li>
            <li class="flex items-start gap-2">
              <span class="w-1 h-1 rounded-full bg-neutral-400 shrink-0 mt-2"></span>
              El check-in es a partir de las 14:00 hrs
            </li>
            <li class="flex items-start gap-2">
              <span class="w-1 h-1 rounded-full bg-neutral-400 shrink-0 mt-2"></span>
              Para cancelaciones, comuníquese con 24 hrs de anticipación
            </li>
          </ul>
        </div>
      </div>
    </div>
    }
  `,
})
export class InfoAlertComponent {
  readonly estado = input.required<EstadoReserva>();
}
