import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoReserva } from '../../interfaces';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (estado() === 'CONFIRMADA') {
    <div class="flex flex-col sm:flex-row gap-3">
      <button
        (click)="onDescargarPDF()"
        class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-bosque-900 hover:bg-bosque-800 text-white text-sm font-semibold rounded-lg transition-all active:scale-[0.97]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        Descargar PDF
      </button>
      <button
        (click)="onImprimir()"
        class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-sm font-semibold rounded-lg transition-all active:scale-[0.97]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
        </svg>
        Imprimir
      </button>
    </div>
    }
  `,
})
export class ActionButtonsComponent {
  estado = input.required<EstadoReserva>();
  descargarPDF = output<void>();
  imprimir = output<void>();

  onDescargarPDF() {
    this.descargarPDF.emit();
  }

  onImprimir() {
    this.imprimir.emit();
  }
}