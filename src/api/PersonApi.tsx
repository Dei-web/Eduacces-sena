import { IPersona, IPersonaUpdate } from "@/types/Person";
import { ICreatePersona } from "@/types/PersonCreate";

const BASE_URL = "http://localhost:3000/persona";

// Retornamos un tipo compatible con HeadersInit
function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPersonas(): Promise<IPersona[]> {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    } as HeadersInit,
  });

  if (!res.ok) throw new Error("Error al obtener personas");
  return res.json();
}

export async function getPersona(id: number): Promise<IPersona> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    } as HeadersInit,
  });

  if (!res.ok) throw new Error("Error al obtener la persona");
  return res.json();
}

export async function createPersona(
  persona: ICreatePersona,
): Promise<IPersona> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    } as HeadersInit,
    body: JSON.stringify(persona),
  });

  if (!res.ok) throw new Error("Error al crear persona");
  return res.json();
}

// Y actualizar la función updatePersona
export async function updatePersona(
  id: number,
  persona: IPersonaUpdate, // ← Cambiar a IPersonaUpdate
): Promise<IPersona> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    } as HeadersInit,
    body: JSON.stringify(persona),
  });

  if (!res.ok) throw new Error("Error al actualizar persona");
  return res.json();
}

export async function deletePersona(id: number): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    } as HeadersInit,
  });

  if (!res.ok) throw new Error("Error al eliminar persona");
  return res.json();
}
