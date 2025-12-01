import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DepartamentoResponse } from '../../../interfaces/departamento/departamento-response.interface';
import { DepartamentoService } from '../../../services/departamento.service';

@Component({
  standalone: true,
  selector: 'app-departamentos-page',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './departamentos-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartamentosPageComponent {

  private departamentoService = inject(DepartamentoService);


  departamentos = signal<DepartamentoResponse[]>([]);
  loading = signal<boolean>(true);
  busqueda = signal<string>('');

  constructor() {
    this.loadDepartamentos();
  }

  loadDepartamentos() {
      this.loading.set(true);
      this.departamentoService.getAll().subscribe({
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
  }
}
