import React, { useState } from "react";
import { X, Fingerprint, CheckCircle, AlertCircle } from "lucide-react";

export default function FingerprintModal({ isOpen, onClose }) {
  const [scanStatus, setScanStatus] = useState("idle");
  const [progress, setProgress] = useState(0);

  const startScan = () => {
    setScanStatus("scanning");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStatus(Math.random() > 0.2 ? "success" : "error");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const resetScan = () => {
    setScanStatus("idle");
    setProgress(0);
  };

  const handleClose = () => {
    resetScan();
    onClose();
  };

  const getStatusConfig = () => {
    switch (scanStatus) {
      case "scanning":
        return {
          title: "Escaneando huella...",
          subtitle: "Mantén el dedo presionado en el sensor",
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          buttonText: "Escaneando...",
          buttonDisabled: true,
        };
      case "success":
        return {
          title: "¡Huella capturada!",
          subtitle: "La huella se ha registrado exitosamente",
          color: "text-green-600",
          bgColor: "bg-green-100",
          buttonText: "Finalizar",
          buttonDisabled: false,
        };
      case "error":
        return {
          title: "Error en el escaneo",
          subtitle: "No se pudo capturar la huella. Intenta de nuevo",
          color: "text-red-600",
          bgColor: "bg-red-100",
          buttonText: "Reintentar",
          buttonDisabled: false,
        };
      default:
        return {
          title: "Registro de huella dactilar",
          subtitle: "Coloca tu dedo en el sensor para comenzar",
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          buttonText: "Iniciar escaneo",
          buttonDisabled: false,
        };
    }
  };

  const status = getStatusConfig();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Captura de Huella</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-8 text-center">
          <div
            className={`mx-auto w-32 h-32 rounded-full ${status.bgColor} flex items-center justify-center mb-6 relative overflow-hidden`}
          >
            {scanStatus === "scanning" && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -skew-x-12 animate-pulse"></div>
            )}

            {scanStatus === "success" ? (
              <CheckCircle className={`w-16 h-16 ${status.color}`} />
            ) : scanStatus === "error" ? (
              <AlertCircle className={`w-16 h-16 ${status.color}`} />
            ) : (
              <Fingerprint
                className={`w-16 h-16 ${status.color} ${scanStatus === "scanning" ? "animate-pulse" : ""}`}
              />
            )}
          </div>

          {scanStatus === "scanning" && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{progress}%</p>
            </div>
          )}

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {status.title}
          </h3>
          <p className="text-gray-600 mb-8">{status.subtitle}</p>

          <div className="space-y-3">
            <button
              onClick={() => {
                if (scanStatus === "idle") {
                  startScan();
                } else if (scanStatus === "error") {
                  resetScan();
                } else if (scanStatus === "success") {
                  handleClose();
                }
              }}
              disabled={status.buttonDisabled}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                status.buttonDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : scanStatus === "success"
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl"
                    : scanStatus === "error"
                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {status.buttonText}
            </button>

            {scanStatus !== "scanning" && (
              <button
                onClick={handleClose}
                className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors duration-200"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-blue-600">
              <strong>Nota:</strong> Proyecto eduacces de la mano de exelentes
              desarrolladores de sotfware
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
