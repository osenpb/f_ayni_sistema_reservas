import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReservaPublicService } from '../../services/reserva-public.service';
import { HotelPublic } from '../../interfaces/hotel-public.interface';
import { DepartamentoPublic } from '../../interfaces/departamento-public.interface';

@Component({
  standalone: true,
  selector: 'app-hoteles-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './hoteles-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelesPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private reservaService = inject(ReservaPublicService);

  departamento = signal<DepartamentoPublic | null>(null);
  hoteles = signal<HotelPublic[]>([]);
  loading = signal<boolean>(true);
  depId = signal<number | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('depId');

    if (id) {
      this.depId.set(Number(id));
      this.loadHoteles(Number(id));
    }
  }

  loadHoteles(depId: number): void {
    this.loading.set(true);

    this.reservaService.getHotelesPorDepartamento(depId).subscribe({
      next: (response) => {
        this.departamento.set(response.departamento);
        this.hoteles.set(response.hoteles || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando hoteles', err);
        this.loading.set(false);
      },
    });
  }

  // Obtener imagen del hotel (placeholder)
  getImagenHotel(nombre: string, index: number): string {
    const keywords = ['hotel', 'resort', 'luxury', 'room', 'lobby'];
    const keyword = keywords[index % keywords.length];
    return `https://source.unsplash.com/400x300/?${keyword},interior`;
  }

  // Obtener calificación ficticia para mostrar estrellas
  getEstrellas(): number {
    return Math.floor(Math.random() * 2) + 4; // 4 o 5 estrellas
  }
}
