export interface IAsistencia {
  id_asistencia: number;
  id_persona: number;
  fecha: string; // ISO date string
  hora_entrada?: string;
  hora_salida?: string;
  estado: "ENTRADA" | "SALIDA";
  createdAt?: string;
  updatedAt?: string;
}

export interface IAsistenciaResponse {
  ok: string;
  data: {
    id_registro: number;
    confianza: number;
  };
}
