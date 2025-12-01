
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { HotelResponse } from '../../../interfaces/hotel/hotel-response.interface';
import { HotelService } from '../../../services/hotel.service';
import { DepartamentoService } from '../../../services/departamento.service';
import { DepartamentoResponse } from '../../../interfaces/departamento/departamento-response.interface';


@Component({
  standalone: true,
  selector: 'app-hoteles-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './hoteles-page.component.html',

})
export class HotelesPageComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private hotelService = inject(HotelService);
  private departamentoService = inject(DepartamentoService);

  hoteles = signal<HotelResponse[]>([]);
  departamentos = signal<DepartamentoResponse[]>([]);
  loading = signal(false);

  ngOnInit() {

    this.loadHoteles();
    this.loadDepartamentos();
  }

loadHoteles() {
  console.log('Llamando a getAll()...');
  this.hotelService.getAll().subscribe({
    next: (data) => {
      console.log('Hoteles recibidos:', data);
      this.hoteles.set(data);
      this.loading.set(false);
    },
    error: (error) => {
      console.error('Error al cargar hoteles:', error);
      this.loading.set(false);
    }
  });
}

loadDepartamentos() {
  console.log('Llamando a getDepartamentos()...');
  this.departamentoService.getAll().subscribe({
    next: (data) => {
      console.log('Departamentos recibidos:', data);
      this.departamentos.set(data);
    },
    error: (error) => {
      console.error('Error al cargar departamentos:', error);
    }
  });
}
}
