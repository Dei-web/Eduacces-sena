import { useState } from "react";
import { enrollHuella } from "@/api/huellaApi";

type Status = "idle" | "working" | "success" | "error";

export function useEnrollHuella(apiBase?: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  const doEnroll = async (idPersona: number, onSuccess?: () => void) => {
    if (status === "working") return;

    setStatus("working");
    setServerMsg(null);

    try {
      await enrollHuella(idPersona, apiBase);
      setStatus("success");
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setStatus("error");

      if (err instanceof Error) {
        setServerMsg(err.message);
      } else if (typeof err === "string") {
        setServerMsg(err);
      } else {
        setServerMsg("Error desconocido");
      }
    }
  };

  const reset = () => {
    setStatus("idle");
    setServerMsg(null);
  };

  return { status, serverMsg, doEnroll, reset };
}
