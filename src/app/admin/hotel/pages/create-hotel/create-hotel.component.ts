import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Departamento } from '../../../interfaces/departamento.interface';
import { DepartamentoService } from '../../../departamento/departamento.service';
import { HotelService } from '../../services/hotel.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-hotel.component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-hotel.component.html',

})
export class CreateHotelComponent {

  private fb = inject(FormBuilder);
  private hotelService = inject(HotelService);
  private departamentoService = inject(DepartamentoService);

  departamentos = signal<Departamento[]>([]);

  hotelForm = this.fb.group({
    nombre: ['', Validators.required],
    direccion: ['', Validators.required],
    departamentoId: ['', Validators.required]
  });

  constructor() {
    this.loadDepartamentos();
  }

  loadDepartamentos() {
    this.departamentoService.getAll().subscribe((data) => {
      this.departamentos.set(data);
    });
  }

  onSubmit() {
    if (this.hotelForm.invalid) return;

    const formValue = this.hotelForm.getRawValue();

    const hotelData = {
      ...formValue,
      nombre: formValue.nombre ?? '', // aunque me gustaria evitar esto luego
      direccion: formValue.direccion ?? '', // x2
      departamentoId: Number(formValue.departamentoId)
    };

    this.hotelService.createHotel(hotelData).subscribe({
      next: () => {
        alert("Hotel creado con éxito");
        this.hotelForm.reset();
      },
      error: (err) => console.log(err)
    });
  }
}
