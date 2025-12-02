import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  LogIn,
  LogOut,
  Calendar,
  Loader2,
  CheckCircle2,
  XCircle,
  Fingerprint,
  User,
} from "lucide-react";
import { getAsistencias } from "@/api/asistencias";
import { getPersonas } from "@/api/PersonApi";
import { IAsistencia } from "@/types/Asistencias";
import { IPersona } from "@/types/Person";
import EnrollFingerprintModal from "@/components/EnrollFingerprintModal";

interface IMessage {
  type: "success" | "error" | "";
  text: string;
}

type ModalType = "entrada" | "salida" | null;

export default function AsistenciaComponent() {
  const [personas, setPersonas] = useState<IPersona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<number | null>(null);
  const [asistencias, setAsistencias] = useState<IAsistencia[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPersonas, setLoadingPersonas] = useState<boolean>(false);
  const [message, setMessage] = useState<IMessage>({ type: "", text: "" });
  const [modalOpen, setModalOpen] = useState<ModalType>(null);

  useEffect(() => {
    fetchPersonas();
    fetchAsistencias();
  }, []);

  const fetchPersonas = async (): Promise<void> => {
    try {
      setLoadingPersonas(true);
      const data: IPersona[] = await getPersonas();
      setPersonas(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al cargar personas";
      showMessage("error", errorMessage);
    } finally {
      setLoadingPersonas(false);
    }
  };

  const fetchAsistencias = async (): Promise<void> => {
    try {
      setLoading(true);
      const data: IAsistencia[] = await getAsistencias();
      setAsistencias(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al cargar asistencias";
      showMessage("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarEntrada = (): void => {
    if (!selectedPersona) {
      showMessage("error", "Seleccione una persona primero");
      return;
    }
    setModalOpen("entrada");
  };

  const handleMarcarSalida = (): void => {
    if (!selectedPersona) {
      showMessage("error", "Seleccione una persona primero");
      return;
    }
    setModalOpen("salida");
  };

  const handleModalSuccess = async (): Promise<void> => {
    const tipo = modalOpen === "entrada" ? "Entrada" : "Salida";
    showMessage("success", `${tipo} registrada exitosamente`);
    await fetchAsistencias();
    setModalOpen(null);
  };

  const handleModalClose = (): void => {
    setModalOpen(null);
  };

  const showMessage = (type: "success" | "error", text: string): void => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string | null | undefined): string => {
    if (!timeString) return "-";
    return timeString.substring(0, 5);
  };

  const getEstadoBadge = (estado: "ENTRADA" | "SALIDA") => {
    if (estado === "ENTRADA") {
      return (
        <Badge variant="default" className="bg-blue-500">
          <LogIn className="w-3 h-3 mr-1" />
          Entrada
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-green-500 text-white">
        <LogOut className="w-3 h-3 mr-1" />
        Salida
      </Badge>
    );
  };

  const getPersonaNombre = (idPersona: number): string => {
    const persona = personas.find((p) => p.id_persona === idPersona);
    return persona ? `${persona.nombre} ${persona.apellido}` : "Desconocido";
  };

  const selectedPersonaData = personas.find(
    (p) => p.id_persona === selectedPersona,
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Control de Asistencia</h1>
        <p className="text-muted-foreground">
          Selecciona una persona y registra entrada/salida con huella digital
        </p>
      </div>

      {message.text && (
        <Alert
          className={`mb-6 ${
            message.type === "error"
              ? "border-red-500 bg-red-50"
              : "border-green-500 bg-green-50"
          }`}
        >
          {message.type === "error" ? (
            <XCircle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription
            className={
              message.type === "error" ? "text-red-800" : "text-green-800"
            }
          >
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Selector de Persona */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Seleccionar Persona
          </CardTitle>
          <CardDescription>
            Elige la persona que marcará asistencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedPersona?.toString()}
            onValueChange={(value) => setSelectedPersona(Number(value))}
            disabled={loadingPersonas}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una persona..." />
            </SelectTrigger>
            <SelectContent>
              {loadingPersonas ? (
                <SelectItem value="loading" disabled>
                  Cargando personas...
                </SelectItem>
              ) : personas.length === 0 ? (
                <SelectItem value="empty" disabled>
                  No hay personas registradas
                </SelectItem>
              ) : (
                personas.map((persona) => (
                  <SelectItem
                    key={persona.id_persona}
                    value={persona.id_persona.toString()}
                  >
                    {persona.nombre} {persona.apellido} - {persona.documento}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {selectedPersonaData && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                Persona seleccionada:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                <div>
                  <span className="font-medium">Nombre:</span>{" "}
                  {selectedPersonaData.nombre} {selectedPersonaData.apellido}
                </div>
                <div>
                  <span className="font-medium">Documento:</span>{" "}
                  {selectedPersonaData.documento}
                </div>
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedPersonaData.correo || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Teléfono:</span>{" "}
                  {selectedPersonaData.telefono || "N/A"}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botones de Marcar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-blue-600" />
              Marcar Entrada
            </CardTitle>
            <CardDescription>
              Coloca tu huella digital para registrar tu llegada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleMarcarEntrada}
              disabled={!selectedPersona}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Fingerprint className="mr-2 h-5 w-5" />
              Marcar Entrada
            </Button>
            {!selectedPersona && (
              <p className="text-xs text-red-500 mt-2 text-center">
                Selecciona una persona primero
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-green-600" />
              Marcar Salida
            </CardTitle>
            <CardDescription>
              Coloca tu huella digital para registrar tu salida
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleMarcarSalida}
              disabled={!selectedPersona}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Fingerprint className="mr-2 h-5 w-5" />
              Marcar Salida
            </Button>
            {!selectedPersona && (
              <p className="text-xs text-red-500 mt-2 text-center">
                Selecciona una persona primero
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instrucciones */}
      <Card className="mb-8 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Fingerprint className="w-5 h-5" />
            Instrucciones
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Selecciona la persona del listado desplegable</li>
            <li>Haz clic en "Marcar Entrada" o "Marcar Salida"</li>
            <li>Coloca el dedo en el sensor de huellas del ESP32</li>
            <li>Mantén el dedo quieto hasta que se complete el registro</li>
            <li>Espera la confirmación en pantalla</li>
          </ol>
        </CardContent>
      </Card>

      {/* Historial de Asistencias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Historial de Asistencias
          </CardTitle>
          <CardDescription>
            Visualiza los registros de asistencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : asistencias.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No hay registros de asistencia</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      ID
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Persona
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Fecha
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Entrada
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Salida
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {asistencias.map((asistencia: IAsistencia) => (
                    <tr
                      key={asistencia.id_asistencia}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">
                        #{asistencia.id_asistencia}
                      </td>
                      <td className="p-4 align-middle">
                        {getPersonaNombre(asistencia.id_persona)}
                      </td>
                      <td className="p-4 align-middle">
                        {formatDate(asistencia.fecha)}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {formatTime(asistencia.hora_entrada)}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {formatTime(asistencia.hora_salida)}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {getEstadoBadge(asistencia.estado)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Huella Digital - ✅ AGREGADO mode="verify" */}
      {selectedPersona && (
        <EnrollFingerprintModal
          isOpen={modalOpen !== null}
          onClose={handleModalClose}
          idPersona={selectedPersona}
          onSuccess={handleModalSuccess}
          mode="verify" // ← CAMBIO IMPORTANTE: Siempre verificar para asistencias
          type={modalOpen === "entrada" ? "entrada" : "salida"}
        />
      )}
    </div>
  );
}
