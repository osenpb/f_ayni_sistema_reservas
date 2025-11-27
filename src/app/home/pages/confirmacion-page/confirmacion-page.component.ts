import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReservaPublicService } from '../../services/reserva-public.service';
import { ReservaDetalleResponse } from '../../interfaces/reserva-public.interface';

@Component({
  standalone: true,
  selector: 'app-confirmacion-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmacion-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmacionPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private reservaService = inject(ReservaPublicService);

  reservaId = signal<number | null>(null);
  reserva = signal<ReservaDetalleResponse | null>(null);
  loading = signal<boolean>(true);
  error = signal<boolean>(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('reservaId');

    if (id) {
      this.reservaId.set(Number(id));
      this.loadReserva(Number(id));
    }
  }

  loadReserva(id: number): void {
    this.loading.set(true);

    this.reservaService.getReservaDetalle(id).subscribe({
      next: (data) => {
        this.reserva.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando reserva:', err);
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  formatCurrency(amount: number): string {
    return `S/ ${amount.toFixed(2)}`;
  }

  calcularNoches(): number {
    const reserva = this.reserva();
    if (!reserva) return 0;

    const inicio = new Date(reserva.fechaInicio);
    const fin = new Date(reserva.fechaFin);
    const diff = fin.getTime() - inicio.getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  imprimirComprobante(): void {
    window.print();
  }
}
