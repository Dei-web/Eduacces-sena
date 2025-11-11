export interface IPersona {
  id_persona: number;
  documento: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  rol: string;
}

export interface IPersonaUpdate {
  documento: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
}
