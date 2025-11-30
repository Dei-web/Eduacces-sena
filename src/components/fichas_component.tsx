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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Interfaz para Carrera
interface Carrera {
  id_carrera: number;
  nombre: string;
  descripcion: string;
}

// Interfaz para Ficha que coincide con el modelo de Sequelize
interface Ficha {
  id_ficha?: number;
  numero_ficha: number;
  id_carrera: number;
  carrera?: Carrera; // Relación con carrera (opcional, si viene del backend)
}

// Formulario vacío inicial
const EMPTY_FORM: Omit<Ficha, "id_ficha"> = {
  numero_ficha: 0,
  id_carrera: 0,
};

export default function FichasManager() {
  // Estados para la tabla y datos
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [carrerasLoading, setCarrerasLoading] = useState(true);

  // Estados para modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Estados para formularios
  const [formData, setFormData] = useState<Omit<Ficha, "id_ficha">>(EMPTY_FORM);
  const [selectedFicha, setSelectedFicha] = useState<Ficha | null>(null);

  // Estados para notificaciones
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  // URLs de la API
  const API_FICHAS_URL = "http://localhost:3000/fichas";
  const API_CARRERAS_URL = "http://localhost:3000/carreras";

  // Token de autenticación
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

  // 🔵 GET /carreras - Obtener todas las carreras para el selector
  const fetchCarreras = async () => {
    setCarrerasLoading(true);
    try {
      const response = await fetch(API_CARRERAS_URL, {
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
      setCarrerasLoading(false);
    }
  };

  // 🔵 GET /fichas - Obtener todas las fichas
  const fetchFichas = async () => {
    setTableLoading(true);
    try {
      const response = await fetch(API_FICHAS_URL, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Error al cargar las fichas");
      }

      const data = await response.json();
      setFichas(data);
    } catch (error) {
      showNotification("error", "No se pudieron cargar las fichas");
      console.error(error);
    } finally {
      setTableLoading(false);
    }
  };

  // 🟢 POST /fichas - Crear nueva ficha
  const handleCreate = async () => {
    if (!formData.numero_ficha || formData.numero_ficha <= 0) {
      showNotification("error", "El número de ficha debe ser mayor a 0");
      return;
    }

    if (!formData.id_carrera || formData.id_carrera <= 0) {
      showNotification("error", "Debes seleccionar una carrera");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_FICHAS_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          numero_ficha: formData.numero_ficha,
          id_carrera: formData.id_carrera,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la ficha");
      }

      showNotification("success", "Ficha creada correctamente");
      setIsCreateModalOpen(false);
      setFormData(EMPTY_FORM);
      fetchFichas();
    } catch (error) {
      showNotification("error", "No se pudo crear la ficha");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🟡 PUT /fichas/:id_ficha - Actualizar ficha existente
  const handleUpdate = async () => {
    if (!selectedFicha?.id_ficha) {
      showNotification("error", "No hay ficha seleccionada");
      return;
    }

    if (!formData.numero_ficha || formData.numero_ficha <= 0) {
      showNotification("error", "El número de ficha debe ser mayor a 0");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_FICHAS_URL}/${selectedFicha.id_ficha}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            numero_ficha: formData.numero_ficha,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Error al actualizar la ficha");
      }

      showNotification("success", "Ficha actualizada correctamente");
      setIsEditModalOpen(false);
      setFormData(EMPTY_FORM);
      setSelectedFicha(null);
      fetchFichas();
    } catch (error) {
      showNotification("error", "No se pudo actualizar la ficha");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔴 DELETE /fichas/:id_ficha - Eliminar ficha
  const handleDelete = async () => {
    if (!selectedFicha?.id_ficha) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_FICHAS_URL}/${selectedFicha.id_ficha}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la ficha");
      }

      showNotification("success", "Ficha eliminada correctamente");
      setIsDeleteDialogOpen(false);
      setSelectedFicha(null);
      fetchFichas();
    } catch (error) {
      showNotification("error", "No se pudo eliminar la ficha");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de edición con datos precargados
  const openEditModal = (ficha: Ficha) => {
    setSelectedFicha(ficha);
    setFormData({
      numero_ficha: ficha.numero_ficha,
      id_carrera: ficha.id_carrera,
    });
    setIsEditModalOpen(true);
  };

  // Abrir diálogo de confirmación de eliminación
  const openDeleteDialog = (ficha: Ficha) => {
    setSelectedFicha(ficha);
    setIsDeleteDialogOpen(true);
  };

  // Obtener el nombre de la carrera por ID
  const getCarreraNombre = (id_carrera: number): string => {
    const carrera = carreras.find((c) => c.id_carrera === id_carrera);
    return carrera ? carrera.nombre : "Carrera no encontrada";
  };

  // Cargar carreras y fichas al montar el componente
  useEffect(() => {
    fetchCarreras();
    fetchFichas();
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
          <h1 className="text-3xl font-bold">Gestión de Fichas</h1>
          <p className="text-muted-foreground mt-1">
            Administra las fichas del sistema
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={carreras.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Ficha
        </Button>
      </div>

      {/* Advertencia si no hay carreras */}
      {carreras.length === 0 && !carrerasLoading && (
        <Alert className="mb-6">
          <AlertDescription>
            No hay carreras registradas. Debes crear al menos una carrera antes
            de poder crear fichas.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabla de fichas */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Número de Ficha</TableHead>
              <TableHead>Carrera</TableHead>
              <TableHead className="text-right w-[150px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableLoading ? (
              <TableRow key="loading-row">
                <TableCell colSpan={4} className="text-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Cargando fichas...
                  </p>
                </TableCell>
              </TableRow>
            ) : fichas.length === 0 ? (
              <TableRow key="empty-row">
                <TableCell colSpan={4} className="text-center py-10">
                  <p className="text-muted-foreground">
                    No hay fichas registradas
                  </p>
                  {carreras.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Crear primera ficha
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              fichas.map((ficha) => (
                <TableRow key={ficha.id_ficha}>
                  <TableCell className="font-medium">
                    {ficha.id_ficha}
                  </TableCell>
                  <TableCell className="font-medium">
                    {ficha.numero_ficha}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {getCarreraNombre(ficha.id_carrera)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(ficha)}
                        title="Editar ficha"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => openDeleteDialog(ficha)}
                        title="Eliminar ficha"
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

      {/* Modal de Crear Ficha */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Ficha</DialogTitle>
            <DialogDescription>
              Completa los campos para crear una nueva ficha en el sistema
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="numero_ficha">
                Número de Ficha <span className="text-red-500">*</span>
              </Label>
              <Input
                id="numero_ficha"
                type="number"
                placeholder="Ej: 2891234"
                min="1"
                value={formData.numero_ficha || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numero_ficha: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="carrera">
                Carrera <span className="text-red-500">*</span>
              </Label>
              {carrerasLoading ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm">Cargando carreras...</span>
                </div>
              ) : (
                <Select
                  value={formData.id_carrera?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, id_carrera: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una carrera" />
                  </SelectTrigger>
                  <SelectContent>
                    {carreras.map((carrera) => (
                      <SelectItem
                        key={carrera.id_carrera}
                        value={carrera.id_carrera.toString()}
                      >
                        {carrera.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
              Crear Ficha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Editar Ficha */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Editar Ficha</DialogTitle>
            <DialogDescription>
              Modifica el número de la ficha seleccionada
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-numero_ficha">
                Número de Ficha <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-numero_ficha"
                type="number"
                min="1"
                value={formData.numero_ficha || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numero_ficha: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Carrera Asignada</Label>
              <Input
                value={getCarreraNombre(formData.id_carrera)}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                La carrera no se puede modificar. Elimina y crea una nueva ficha
                si necesitas cambiarla.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setFormData(EMPTY_FORM);
                setSelectedFicha(null);
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
              la ficha <strong>#{selectedFicha?.numero_ficha}</strong> del
              sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSelectedFicha(null);
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
