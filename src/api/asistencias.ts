import { IAsistencia } from "@/types/Asistencias";

const BASE_URL = "http://localhost:3000/asistencia";

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// POST /asistencia → marcar entrada
export async function marcarEntrada(): Promise<{
  ok: string;
  data: {
    id_registro: number;
    confianza: number;
  };
}> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    } as HeadersInit,
  });
  console.log(res);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error al marcar entrada");
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  throw new Error("Respuesta no es JSON");
}

// POST /asistencia/salida → marcar salida
export async function marcarSalida(): Promise<{
  ok: string;
  data: {
    id_registro: number;
    confianza: number;
  };
}> {
  const res = await fetch(`${BASE_URL}/salida`, {
    // ← Cambia backticks a paréntesis con template literal
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    } as HeadersInit,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error al marcar salida");
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  throw new Error("Respuesta no es JSON");
}

// GET /asistencia → listar asistencias
export async function getAsistencias(): Promise<IAsistencia[]> {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    } as HeadersInit,
  });

  if (!res.ok) throw new Error("Error al obtener asistencias");
  return res.json();
}
