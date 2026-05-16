import { ReservaResponse } from '../../../interfaces';

export class ConfirmationDataAccessors {

  static hotelNombre(reserva: ReservaResponse | null): string {
    return reserva?.hotel?.nombre ?? 'N/A';
  }

  static hotelDireccion(reserva: ReservaResponse | null): string {
    return reserva?.hotel?.direccion ?? 'N/A';
  }

  static clienteNombreCompleto(reserva: ReservaResponse | null): string {
    const nombre = reserva?.usuarioNombre;
    const apellido = reserva?.usuarioApellido;
    if (!nombre && !apellido) return 'N/A';
    return `${nombre} ${apellido}`.trim() || 'N/A';
  }

  static clienteDni(reserva: ReservaResponse | null): string {
    return reserva?.usuarioDni ?? 'N/A';
  }

  static clienteEmail(reserva: ReservaResponse | null): string {
    return reserva?.usuarioEmail ?? 'N/A';
  }
}
