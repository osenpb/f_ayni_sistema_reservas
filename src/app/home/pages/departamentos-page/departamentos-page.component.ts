import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DepartamentoPublic } from '../../interfaces/departamento-public.interface';
import { ReservaPublicService } from '../../services/reserva-public.service';

@Component({
  standalone: true,
  selector: 'app-departamentos-page',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './departamentos-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartamentosPageComponent {
  private reservaService = inject(ReservaPublicService);

  departamentos = signal<DepartamentoPublic[]>([]);
  loading = signal<boolean>(true);
  busqueda = signal<string>('');

  constructor() {
    this.loadDepartamentos();
  }

  loadDepartamentos(): void {
    this.loading.set(true);
    this.reservaService.getDepartamentos().subscribe({
      next: (data) => {
        this.departamentos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando departamentos', err);
        this.loading.set(false);
      },
    });
  }

  buscar(): void {
    const termino = this.busqueda().trim();
    this.loading.set(true);

    if (!termino) {
      this.loadDepartamentos();
      return;
    }

    this.reservaService.getDepartamentos(termino).subscribe({
      next: (data) => {
        // El backend puede retornar un objeto o un array
        if (Array.isArray(data)) {
          this.departamentos.set(data);
        } else {
          this.departamentos.set(data ? [data] : []);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error buscando departamentos', err);
        this.departamentos.set([]);
        this.loading.set(false);
      },
    });
  }

  limpiarBusqueda(): void {
    this.busqueda.set('');
    this.loadDepartamentos();
  }

  onBusquedaInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  // Obtener imagen del departamento (placeholder o real)
  getImagenDepartamento(nombre: string): string {
    const nombreLower = nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return `https://source.unsplash.com/400x300/?${nombreLower},peru,landscape`;
  }
}
