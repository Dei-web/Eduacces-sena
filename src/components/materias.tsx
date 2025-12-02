"use client";
import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface Materia {
  id_materia: number;
  nombre: string;
  tipo: string;
}

const MateriasManagement = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
  });

  // Configuración de la API
  const API_BASE_URL = "http://localhost:3000/materias";
  const getToken = () => localStorage.getItem("token"); // Ajusta según tu implementación de auth

  const getApiHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  // Cargar materias al montar el componente
  useEffect(() => {
    fetchMaterias();
  }, []);

  const fetchMaterias = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        headers: getApiHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setMaterias(data);
      } else {
        console.error("Error al cargar materias:", response.status);
      }
    } catch (error) {
      console.error("Error al cargar materias:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterias = materias.filter(
    (materia) =>
      materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materia.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: getApiHeaders(),
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        await fetchMaterias();
        setIsCreateOpen(false);
        resetForm();
      } else {
        console.error("Error al crear materia:", response.status);
      }
    } catch (error) {
      console.error("Error al crear materia:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (selectedMateria) {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/${selectedMateria.id_materia}`,
          {
            method: "PUT",
            headers: getApiHeaders(),
            body: JSON.stringify(formData),
          },
        );
        if (response.ok) {
          await fetchMaterias();
          setIsEditOpen(false);
          resetForm();
        } else {
          console.error("Error al editar materia:", response.status);
        }
      } catch (error) {
        console.error("Error al editar materia:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedMateria) {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/${selectedMateria.id_materia}`,
          {
            method: "DELETE",
            headers: getApiHeaders(),
          },
        );
        if (response.ok) {
          await fetchMaterias();
          setIsDeleteOpen(false);
          setSelectedMateria(null);
        } else {
          console.error("Error al eliminar materia:", response.status);
        }
      } catch (error) {
        console.error("Error al eliminar materia:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const openEditModal = (materia: Materia) => {
    setSelectedMateria(materia);
    setFormData({
      nombre: materia.nombre,
      tipo: materia.tipo,
    });
    setIsEditOpen(true);
  };

  const openDeleteModal = (materia: Materia) => {
    setSelectedMateria(materia);
    setIsDeleteOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      tipo: "",
    });
    setSelectedMateria(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Gestión de Materias
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Administra las materias del sistema
                </p>
              </div>
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Materia
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nombre o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="w-32 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-slate-600">Cargando...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMaterias.map((materia) => (
                    <TableRow key={materia.id_materia}>
                      <TableCell className="font-medium">
                        {materia.id_materia}
                      </TableCell>
                      <TableCell className="font-medium">
                        {materia.nombre}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {materia.tipo}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(materia)}
                            className="text-slate-600 hover:text-blue-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(materia)}
                            className="text-slate-600 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredMaterias.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">No se encontraron materias</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Materia</DialogTitle>
            <DialogDescription>
              Ingresa los datos de la nueva materia
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Ej: Matemáticas"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Input
                id="tipo"
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
                placeholder="Ej: Teórica, Práctica, Taller"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Materia</DialogTitle>
            <DialogDescription>
              Modifica los datos de la materia
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nombre">Nombre *</Label>
              <Input
                id="edit-nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-tipo">Tipo *</Label>
              <Input
                id="edit-tipo"
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              materia{" "}
              <span className="font-semibold">{selectedMateria?.nombre}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MateriasManagement;
