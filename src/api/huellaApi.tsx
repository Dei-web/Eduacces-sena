const BASE_URL = "http://localhost:3000";

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
