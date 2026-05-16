import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservaResponse } from '../../interfaces';
import { CurrencySolPipe } from '../../../../shared/pipes/currency-sol.pipe';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';

@Component({
  selector: 'app-reservation-summary',
  standalone: true,
  imports: [CommonModule, CurrencySolPipe, FormatDatePipe],
  templateUrl: './reservation-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservaSummaryComponent {
  reserva = input.required<ReservaResponse>();

  puedePagar = computed(() => this.reserva().estado === 'PENDIENTE');
}
