import { Ihuella } from "@/types/Huella";

const BASE_URL = "http://localhost:3000";

function getAuthHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  };
}

export async function getUsers(apiBase: string = BASE_URL): Promise<Ihuella[]> {
  const res = await fetch(`${apiBase}/huella-map`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    throw new Error("No se pudo obtener usuarios/huellas");
  }

  return res.json();
}

export async function enrollHuella(
  idPersona: number,
  apiBase: string = BASE_URL,
) {
  const res = await fetch(`${apiBase}/huellas/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_persona: idPersona }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data?.ok) {
    throw new Error(
      data?.message || "No se pudo enrolar la huella (ESP32 / Backend)",
    );
  }

  return data;
}

export async function deleteEnrollHuella(
  idPersona: number,
  apiBase: string = BASE_URL,
) {
  const res = await fetch(`${apiBase}/huellas/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_persona: idPersona }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Error al eliminar la huella");
  }

  return data;
}
