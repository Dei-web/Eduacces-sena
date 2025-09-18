"use client";

import React from "react";
import { X, Fingerprint, CheckCircle, AlertCircle } from "lucide-react";
import { useEnrollHuella } from "@/hooks/useEnrollHuella";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  idPersona: number;
  apiBase?: string;
  onSuccess?: () => void;
}

export default function EnrollFingerprintModal({
  isOpen,
  onClose,
  idPersona,
  apiBase,
  onSuccess,
}: Props) {
  const { status, serverMsg, doEnroll, reset } = useEnrollHuella(apiBase);

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  const ui = {
    idle: {
      title: "Registro de huella",
      subtitle: "Al comenzar, se te pedirá colocar y retirar el dedo.",
      bg: "bg-gray-100",
      btn: "Iniciar enrolamiento",
      disabled: false,
      icon: <Fingerprint className="w-16 h-16 text-gray-600" />,
    },
    working: {
      title: "Enrolando…",
      subtitle:
        "Sigue las indicaciones del lector: coloca el dedo (1/2), retíralo y vuelve a colocarlo (2/2).",
      bg: "bg-blue-100",
      btn: "Procesando…",
      disabled: true,
      icon: <Fingerprint className="w-16 h-16 text-blue-600 animate-pulse" />,
    },
    success: {
      title: "¡Huella enrolada!",
      subtitle: "El lector guardó la huella correctamente.",
      bg: "bg-green-100",
      btn: "Listo",
      disabled: false,
      icon: <CheckCircle className="w-16 h-16 text-green-600" />,
    },
    error: {
      title: "Error al enrolar",
      subtitle:
        serverMsg ||
        "No se pudo capturar o guardar la huella. Intenta nuevamente.",
      bg: "bg-red-100",
      btn: "Reintentar",
      disabled: false,
      icon: <AlertCircle className="w-16 h-16 text-red-600" />,
    },
  }[status];

  const mainAction = () => {
    if (status === "idle") return doEnroll(idPersona, onSuccess);
    if (status === "error") return reset();
    if (status === "success") return handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Captura de Huella</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 text-center">
          <div
            className={`mx-auto w-32 h-32 rounded-full ${ui.bg} flex items-center justify-center mb-6`}
          >
            {ui.icon}
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {ui.title}
          </h3>
          <p className="text-gray-600 mb-4">{ui.subtitle}</p>

          <div className="space-y-3">
            <button
              onClick={mainAction}
              disabled={ui.disabled}
              className="w-full py-3 px-6 rounded-lg font-semibold transition-all 
              bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              {ui.btn}
            </button>

            <button
              onClick={handleClose}
              className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              {status === "working" ? "Cancelar" : "Cerrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
