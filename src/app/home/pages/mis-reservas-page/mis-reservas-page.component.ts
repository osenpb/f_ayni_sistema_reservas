import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReservaPublicService } from '../../services/reserva-public.service';
import { MisReservasResponse } from '../../interfaces/reserva-public.interface';

@Component({
  standalone: true,
  selector: 'app-mis-reservas-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './mis-reservas-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisReservasPageComponent {
  private reservaService = inject(ReservaPublicService);

  dni = signal<string>('');
  reservasData = signal<MisReservasResponse | null>(null);
  loading = signal<boolean>(false);
  buscado = signal<boolean>(false);
  error = signal<string | null>(null);

  onDniInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Solo permitir números
    const value = input.value.replace(/\D/g, '');
    this.dni.set(value);
    input.value = value;
  }

  buscarReservas(): void {
    const dniValue = this.dni().trim();

    // Validar DNI
    if (!dniValue) {
      this.error.set('Ingrese su número de DNI');
      return;
    }

    if (dniValue.length !== 8) {
      this.error.set('El DNI debe tener 8 dígitos');
      return;
    }

    this.error.set(null);
    this.loading.set(true);
    this.buscado.set(false);

    this.reservaService.getMisReservas(dniValue).subscribe({
      next: (data) => {
        this.reservasData.set(data);
        this.buscado.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error buscando reservas:', err);
        this.reservasData.set(null);
        this.buscado.set(true);
        this.loading.set(false);
      },
    });
  }

  limpiarBusqueda(): void {
    this.dni.set('');
    this.reservasData.set(null);
    this.buscado.set(false);
    this.error.set(null);
  }

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
