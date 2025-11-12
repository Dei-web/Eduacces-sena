import React, { useState, useEffect } from "react";
import {
  Trash2,
  Fingerprint,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HuellaGet, enrollHuella, deleteEnrollHuella } from "@/api/huellaApi";
import { Ihuella } from "@/types/Huella";

// Main Component
export default function HuellaManagementTable() {
  const [huellas, setHuellas] = useState<Ihuella[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    huella: Ihuella | null;
  }>({ open: false, huella: null });

  const TOTAL_MEMORY = 127;

  useEffect(() => {
    loadHuellas();
  }, []);

  const loadHuellas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await HuellaGet();
      setHuellas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (idSensor: number) => {
    try {
      setEnrolling(idSensor);
      setError(null);
      await enrollHuella(idSensor);
      await loadHuellas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enrolar");
    } finally {
      setEnrolling(null);
    }
  };

  const handleDeleteClick = (huella: Ihuella) => {
    setDeleteDialog({ open: true, huella });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.huella) return;

    try {
      setDeleting(deleteDialog.huella.id_sensor);
      setError(null);
      await deleteEnrollHuella(deleteDialog.huella.id_sensor);
      await loadHuellas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleting(null);
      setDeleteDialog({ open: false, huella: null });
    }
  };

  const usedSlots = huellas.length;
  const availableSlots = TOTAL_MEMORY - usedSlots;
  const usagePercentage = (usedSlots / TOTAL_MEMORY) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Gestión de Huellas Dactilares
              </CardTitle>
              <CardDescription>
                Administra las huellas registradas en el sensor
              </CardDescription>
            </div>
            <Button onClick={loadHuellas} disabled={loading} variant="outline">
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Memory Status */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Memoria del Sensor</span>
              <span className="text-muted-foreground">
                {usedSlots} / {TOTAL_MEMORY} espacios utilizados
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  usagePercentage > 90
                    ? "bg-red-500"
                    : usagePercentage > 70
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{availableSlots} espacios disponibles</span>
              <span>{usagePercentage.toFixed(1)}% utilizado</span>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : huellas.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Fingerprint className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay huellas registradas</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">ID Sensor</TableHead>
                    <TableHead>Persona</TableHead>
                    <TableHead className="w-32">Estado</TableHead>
                    <TableHead className="w-32 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {huellas.map((huella) => (
                    <TableRow key={huella.id_sensor}>
                      <TableCell className="font-mono">
                        #{huella.id_sensor.toString().padStart(3, "0")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {huella.persona}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          <Fingerprint className="h-3 w-3 mr-1" />
                          Activo
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(huella)}
                          disabled={deleting === huella.id_sensor}
                        >
                          {deleting === huella.id_sensor ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-500" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, huella: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar huella?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la huella de{" "}
              <span className="font-semibold">
                {deleteDialog.huella?.persona}
              </span>{" "}
              del sensor (ID: {deleteDialog.huella?.id_sensor}). Esta acción no
              se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
