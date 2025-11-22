import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../../interfaces/hotel.interface';
import { HotelService } from '../../services/hotel.service';

@Component({
  standalone: true,
  selector: 'app-list-hotel',
  imports: [CommonModule],
  templateUrl: './list-hotel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListHotelComponent {

  private hotelService = inject(HotelService);

  hoteles = signal<Hotel[]>([]);

  constructor() {
    this.loadAllHoteles();
  }

  loadAllHoteles() {
    this.hotelService.getAllHoteles().subscribe({
      next: (data) => this.hoteles.set(data),
      error: (err) => console.error('Error cargando hoteles', err)
    });
  }

}
