export type EstadoAsistencia = "ESPERA" | "ASISTIO" | "FALLA";

export interface IStudent {
  cedula: string;
  nombre: string;
  apellido: string;
  estado: EstadoAsistencia;
  ficha: string;
  correo: string;
}
