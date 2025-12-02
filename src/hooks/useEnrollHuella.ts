import { useState } from "react";
import { enrollHuella } from "@/api/huellaApi";

type Status = "idle" | "working" | "success" | "error";

export function useEnrollHuella(apiBase?: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState("");

  const baseUrl = apiBase || "http://localhost:3000";

  // Función para enrolar huella (registrar nueva) - USA TU API
  const doEnroll = async (idPersona: number, onSuccess?: () => void) => {
    setStatus("working");
    try {
      // ✅ Usa tu función de API existente
      await enrollHuella(idPersona, baseUrl);

      setStatus("success");
      onSuccess?.();
    } catch (error) {
      setStatus("error");
      setServerMsg(
        error instanceof Error ? error.message : "Error desconocido",
      );
    }
  };

  // Verificar huella para ENTRADA
  const doVerifyEntrada = async (idPersona: number, onSuccess?: () => void) => {
    setStatus("working");
    try {
      const response = await fetch(`${baseUrl}/asistencia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al marcar entrada");
      }

      const data = await response.json();

      // Verificar que la huella corresponda a la persona seleccionada
      if (data.sensorData?.data?.id_registro !== idPersona) {
        throw new Error("La huella no corresponde a la persona seleccionada");
      }

      setStatus("success");
      onSuccess?.();
    } catch (error) {
      setStatus("error");
      setServerMsg(
        error instanceof Error ? error.message : "Error al marcar entrada",
      );
    }
  };

  // Verificar huella para SALIDA
  const doVerifySalida = async (idPersona: number, onSuccess?: () => void) => {
    setStatus("working");
    try {
      const response = await fetch(`${baseUrl}/asistencia/salida`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al marcar salida");
      }

      const data = await response.json();

      // Para salida, verificar el id_persona del mapping o asistencia
      if (data.data?.id_persona !== idPersona) {
        throw new Error("La huella no corresponde a la persona seleccionada");
      }

      setStatus("success");
      onSuccess?.();
    } catch (error) {
      setStatus("error");
      setServerMsg(
        error instanceof Error ? error.message : "Error al marcar salida",
      );
    }
  };

  const reset = () => {
    setStatus("idle");
    setServerMsg("");
  };

  return {
    status,
    serverMsg,
    doEnroll,
    doVerifyEntrada,
    doVerifySalida,
    reset,
  };
}
