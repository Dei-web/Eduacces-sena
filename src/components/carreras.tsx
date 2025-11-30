"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Interfaz que coincide con el modelo de Sequelize
interface Carrera {
  id_carrera?: number;
  nombre: string;
  descripcion: string;
}

// Formulario vacío inicial
const EMPTY_FORM: Carrera = {
  nombre: "",
  descripcion: "",
};

export default function CarrerasManager() {
  // Estados para la tabla y datos
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);

  // Estados para modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Estados para formularios
  const [formData, setFormData] = useState<Carrera>(EMPTY_FORM);
  const [selectedCarrera, setSelectedCarrera] = useState<Carrera | null>(null);

  // Estados para notificaciones
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  // URL base de tu API - AJÚSTALA según tu configuración
  const API_BASE_URL = "http://localhost:3000/carreras";

  // Token de autenticación - DEBES obtenerlo de tu sistema de auth
  const getAuthToken = () => {
    return localStorage.getItem("token") || "";
  };

  // Headers comunes para las peticiones
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAuthToken()}`,
  });

  // Función para mostrar notificaciones temporales
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "success", message: "" });
    }, 5000);
  };

  // 🔵 GET /carreras - Obtener todas las carreras
  const fetchCarreras = async () => {
    setTableLoading(true);
    try {
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Error al cargar las carreras");
      }

      const data = await response.json();
      setCarreras(data);
    } catch (error) {
      showNotification("error", "No se pudieron cargar las carreras");
      console.error(error);
    } finally {
      setTableLoading(false);
    }
  };

  // 🟢 POST /carreras - Crear nueva carrera
  const handleCreate = async () => {
    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      showNotification("error", "Todos los campos son requeridos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la carrera");
      }

      showNotification("success", "Carrera creada correctamente");
      setIsCreateModalOpen(false);
      setFormData(EMPTY_FORM);
      fetchCarreras();
    } catch (error) {
      showNotification("error", "No se pudo crear la carrera");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🟡 PUT /carreras/:id_carrera - Actualizar carrera existente
  const handleUpdate = async () => {
    if (
      !selectedCarrera?.id_carrera ||
      !formData.nombre.trim() ||
      !formData.descripcion.trim()
    ) {
      showNotification("error", "Todos los campos son requeridos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/${selectedCarrera.id_carrera}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            nombre: formData.nombre,
            descripcion: formData.descripcion,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Error al actualizar la carrera");
      }

      showNotification("success", "Carrera actualizada correctamente");
      setIsEditModalOpen(false);
      setFormData(EMPTY_FORM);
      setSelectedCarrera(null);
      fetchCarreras();
    } catch (error) {
      showNotification("error", "No se pudo actualizar la carrera");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔴 DELETE /carreras/:id_carrera - Eliminar carrera
  const handleDelete = async () => {
    if (!selectedCarrera?.id_carrera) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/${selectedCarrera.id_carrera}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la carrera");
      }

      showNotification("success", "Carrera eliminada correctamente");
      setIsDeleteDialogOpen(false);
      setSelectedCarrera(null);
      fetchCarreras();
    } catch (error) {
      showNotification("error", "No se pudo eliminar la carrera");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de edición con datos precargados
  const openEditModal = (carrera: Carrera) => {
    setSelectedCarrera(carrera);
    setFormData({
      nombre: carrera.nombre,
      descripcion: carrera.descripcion,
    });
    setIsEditModalOpen(true);
  };

  // Abrir diálogo de confirmación de eliminación
  const openDeleteDialog = (carrera: Carrera) => {
    setSelectedCarrera(carrera);
    setIsDeleteDialogOpen(true);
  };

  // Cargar carreras al montar el componente
  useEffect(() => {
    fetchCarreras();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Notificación flotante */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 w-96 animate-in slide-in-from-top-5">
          <Alert
            variant={notification.type === "error" ? "destructive" : "default"}
            className={
              notification.type === "success"
                ? "border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50"
                : ""
            }
          >
            {notification.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription className="ml-2">
              {notification.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header con título y botón de crear */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Carreras</h1>
          <p className="text-muted-foreground mt-1">
            Administra las carreras del sistema
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Carrera
        </Button>
      </div>

      {/* Tabla de carreras */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right w-[150px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Cargando carreras...
                  </p>
                </TableCell>
              </TableRow>
            ) : carreras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <p className="text-muted-foreground">
                    No hay carreras registradas
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Crear primera carrera
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              carreras.map((carrera) => (
                <TableRow key={carrera.id_carrera}>
                  <TableCell className="font-medium">
                    {carrera.id_carrera}
                  </TableCell>
                  <TableCell className="font-medium">
                    {carrera.nombre}
                  </TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {carrera.descripcion}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(carrera)}
                        title="Editar carrera"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => openDeleteDialog(carrera)}
                        title="Eliminar carrera"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Crear Carrera */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Carrera</DialogTitle>
            <DialogDescription>
              Completa los campos para crear una nueva carrera en el sistema
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: Ingeniería en Sistemas"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">
                Descripción <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Describe los objetivos y características de la carrera..."
                rows={4}
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormData(EMPTY_FORM);
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Carrera
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Editar Carrera */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Editar Carrera</DialogTitle>
            <DialogDescription>
              Modifica los campos de la carrera seleccionada
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nombre">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-descripcion">
                Descripción <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="edit-descripcion"
                rows={4}
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setFormData(EMPTY_FORM);
                setSelectedCarrera(null);
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmación de Eliminación */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              la carrera <strong>"{selectedCarrera?.nombre}"</strong> del
              sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSelectedCarrera(null);
              }}
              disabled={loading}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
