export interface IUserUpdateRequest {
  id_user: number; // necesario para identificar al usuario
  correo: string; // único campo editable
  id_persona: number; // relación con persona (aunque sea solo lectura aquí)
}

export interface IUserUpdateBody {
  correo: string;
  id_persona: number;
}
