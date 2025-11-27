import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservaPublicService } from '../../services/reserva-public.service';
import { HotelDetailResponse } from '../../interfaces/hotel-public.interface';
import { HabitacionPublic } from '../../interfaces/habitacion-public.interface';
import { ReservaRequest } from '../../interfaces/reserva-public.interface';

@Component({
  standalone: true,
  selector: 'app-reserva-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reserva-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservaPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reservaService = inject(ReservaPublicService);

  hotelId = signal<number | null>(null);
  hotelData = signal<HotelDetailResponse | null>(null);
  habitacionesDisponibles = signal<HabitacionPublic[]>([]);
  habitacionesSeleccionadas = signal<number[]>([]);
  loading = signal<boolean>(true);
  loadingHabitaciones = signal<boolean>(false);
  submitting = signal<boolean>(false);
  fechasSeleccionadas = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Formulario del cliente
  clienteForm = this.fb.group({
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.pattern(/^9\d{8}$/)]],
  });

  // Formulario de fechas
  fechasForm = this.fb.group({
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
  });

  // Fecha mínima (hoy)
  minDate = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('hotelId');

    if (id) {
      this.hotelId.set(Number(id));
      this.loadHotelData(Number(id));
    } else {
      this.router.navigate(['/home/departamentos']);
    }
  }

  loadHotelData(hotelId: number): void {
    this.loading.set(true);

    this.reservaService.getHotelDetalle(hotelId).subscribe({
      next: (data) => {
        this.hotelData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando hotel:', err);
        this.errorMessage.set('No se pudo cargar la información del hotel');
        this.loading.set(false);
      },
    });
  }

  buscarHabitaciones(): void {
    const fechas = this.fechasForm.getRawValue();
    const hotelId = this.hotelId();

    if (!fechas.fechaInicio || !fechas.fechaFin || !hotelId) {
      return;
    }

    // Validar fechas
    const inicio = new Date(fechas.fechaInicio);
    const fin = new Date(fechas.fechaFin);

    if (fin <= inicio) {
      this.errorMessage.set('La fecha de salida debe ser posterior a la fecha de entrada');
      return;
    }

    this.errorMessage.set(null);
    this.loadingHabitaciones.set(true);
    this.habitacionesSeleccionadas.set([]);

    this.reservaService
      .getHabitacionesDisponibles(hotelId, fechas.fechaInicio, fechas.fechaFin)
      .subscribe({
        next: (response) => {
          this.habitacionesDisponibles.set(response.habitacionesDisponibles || []);
          this.fechasSeleccionadas.set(true);
          this.loadingHabitaciones.set(false);
        },
        error: (err) => {
          console.error('Error buscando habitaciones:', err);
          this.habitacionesDisponibles.set([]);
          this.loadingHabitaciones.set(false);
          this.errorMessage.set('Error al buscar habitaciones disponibles');
        },
      });
  }

  toggleHabitacion(habitacionId: number): void {
    const seleccionadas = this.habitacionesSeleccionadas();

    if (seleccionadas.includes(habitacionId)) {
      this.habitacionesSeleccionadas.set(seleccionadas.filter((id) => id !== habitacionId));
    } else {
      this.habitacionesSeleccionadas.set([...seleccionadas, habitacionId]);
    }
  }

  isHabitacionSeleccionada(habitacionId: number): boolean {
    return this.habitacionesSeleccionadas().includes(habitacionId);
  }

  calcularNoches(): number {
    const fechas = this.fechasForm.getRawValue();
    if (!fechas.fechaInicio || !fechas.fechaFin) return 0;

    const inicio = new Date(fechas.fechaInicio);
    const fin = new Date(fechas.fechaFin);
    const diff = fin.getTime() - inicio.getTime();

    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  calcularTotal(): number {
    const habitaciones = this.habitacionesDisponibles();
    const seleccionadas = this.habitacionesSeleccionadas();
    const noches = this.calcularNoches();

    if (seleccionadas.length === 0 || noches <= 0) return 0;

    const totalPorNoche = habitaciones
      .filter((h) => seleccionadas.includes(h.id))
      .reduce((sum, h) => sum + h.precio, 0);

    return totalPorNoche * noches;
  }

  onSubmit(): void {
    // Validar formulario de cliente
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      this.errorMessage.set('Complete todos los datos del cliente correctamente');
      return;
    }

    // Validar fechas
    if (this.fechasForm.invalid) {
      this.errorMessage.set('Seleccione las fechas de entrada y salida');
      return;
    }

    // Validar habitaciones
    if (this.habitacionesSeleccionadas().length === 0) {
      this.errorMessage.set('Seleccione al menos una habitación');
      return;
    }

    const hotelId = this.hotelId();
    if (!hotelId) return;

    const clienteData = this.clienteForm.getRawValue();
    const fechasData = this.fechasForm.getRawValue();

    const reservaRequest: ReservaRequest = {
      fechaInicio: fechasData.fechaInicio!,
      fechaFin: fechasData.fechaFin!,
      habitacionesIds: this.habitacionesSeleccionadas(),
      cliente: {
        dni: clienteData.dni!,
        nombre: clienteData.nombre!,
        apellido: clienteData.apellido!,
        correo: clienteData.correo!,
      },
    };

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.reservaService.crearReserva(hotelId, reservaRequest).subscribe({
      next: (response) => {
        this.router.navigate(['/home/reserva', response.id, 'confirmacion']);
      },
      error: (err) => {
        console.error('Error creando reserva:', err);
        this.submitting.set(false);
        this.errorMessage.set(err.error?.error || 'Error al crear la reserva. Intente nuevamente.');
      },
    });
  }

  formatCurrency(amount: number): string {
    return `S/ ${amount.toFixed(2)}`;
  }

  // Getters para validaciones
  get dniInvalid(): boolean {
    const control = this.clienteForm.get('dni');
    return !!(control?.invalid && control?.touched);
  }

  get nombreInvalid(): boolean {
    const control = this.clienteForm.get('nombre');
    return !!(control?.invalid && control?.touched);
  }

  get apellidoInvalid(): boolean {
    const control = this.clienteForm.get('apellido');
    return !!(control?.invalid && control?.touched);
  }

  get correoInvalid(): boolean {
    const control = this.clienteForm.get('correo');
    return !!(control?.invalid && control?.touched);
  }
}
