"use client";
import { useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Swal from "sweetalert2";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddDocenteModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddDocenteModal({
  open,
  onClose,
  onAdded,
}: AddDocenteModalProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    correo: "",
    telefono: "",
    ficha: "",
    materia: "",
  });

  // Datos para los selectores
  const fichas = ["2024-A", "2024-B", "2024-C", "2025-A", "2025-B"];
  const materias = [
    "Matemáticas",
    "Programación",
    "Base de Datos",
    "Redes",
    "Inglés",
    "Física",
    "Química",
    "Sistemas Operativos",
    "Arquitectura de Software",
    "Desarrollo Web",
    "Seguridad Informática",
    "Inteligencia Artificial",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          title: "Archivo inválido",
          text: "Por favor seleccione un archivo de imagen válido",
          icon: "warning",
        });
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Archivo muy grande",
          text: "La imagen no debe superar los 5MB",
          icon: "warning",
        });
        return;
      }

      setImageFile(file);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      documento: "",
      correo: "",
      telefono: "",
      ficha: "",
      materia: "",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      Swal.fire({
        title: "Campo requerido",
        text: "El nombre es obligatorio",
        icon: "warning",
      });
      return false;
    }

    if (!formData.apellido.trim()) {
      Swal.fire({
        title: "Campo requerido",
        text: "El apellido es obligatorio",
        icon: "warning",
      });
      return false;
    }

    if (!formData.documento.trim()) {
      Swal.fire({
        title: "Campo requerido",
        text: "El documento es obligatorio",
        icon: "warning",
      });
      return false;
    }

    if (formData.documento.length < 6) {
      Swal.fire({
        title: "Documento inválido",
        text: "El documento debe tener al menos 6 caracteres",
        icon: "warning",
      });
      return false;
    }

    if (!formData.correo.trim() || !formData.correo.includes("@")) {
      Swal.fire({
        title: "Correo inválido",
        text: "Ingrese un correo electrónico válido",
        icon: "warning",
      });
      return false;
    }

    if (formData.telefono && formData.telefono.length < 7) {
      Swal.fire({
        title: "Teléfono inválido",
        text: "El teléfono debe tener al menos 7 dígitos",
        icon: "warning",
      });
      return false;
    }

    if (!formData.ficha) {
      Swal.fire({
        title: "Campo requerido",
        text: "Seleccione una ficha",
        icon: "warning",
      });
      return false;
    }

    if (!formData.materia) {
      Swal.fire({
        title: "Campo requerido",
        text: "Seleccione una materia",
        icon: "warning",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Aquí iría la llamada real a la API con FormData para incluir la imagen
      // const formDataToSend = new FormData();
      // formDataToSend.append('nombre', formData.nombre);
      // formDataToSend.append('apellido', formData.apellido);
      // formDataToSend.append('documento', formData.documento);
      // formDataToSend.append('correo', formData.correo);
      // formDataToSend.append('telefono', formData.telefono);
      // formDataToSend.append('ficha', formData.ficha);
      // formDataToSend.append('materia', formData.materia);
      // if (imageFile) {
      //   formDataToSend.append('imagen', imageFile);
      // }
      //
      // const response = await fetch('/api/docentes', {
      //   method: 'POST',
      //   body: formDataToSend,
      // });
      // if (!response.ok) throw new Error('Error al crear docente');

      // Simulación de creación
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Swal.fire({
        title: "¡Creado!",
        text: `El docente ${formData.nombre} ${formData.apellido} ha sido agregado correctamente`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      resetForm();
      onAdded();
      onClose();
    } catch (error) {
      console.error("Error al crear docente:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo crear el docente. Intente nuevamente.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Agregar Nuevo Docente
          </DialogTitle>
          <DialogDescription>
            Complete la información del nuevo docente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Sección de Imagen */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Foto de Perfil (Opcional)
            </Label>
            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 rounded-full object-cover border-4 border-indigo-100"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Click para subir imagen
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF (máx. 5MB)
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4" />

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Ingrese el nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido" className="text-sm font-medium">
                Apellido <span className="text-red-500">*</span>
              </Label>
              <Input
                id="apellido"
                type="text"
                placeholder="Ingrese el apellido"
                value={formData.apellido}
                onChange={(e) => handleInputChange("apellido", e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>
          </div>

          {/* Documento */}
          <div className="space-y-2">
            <Label htmlFor="documento" className="text-sm font-medium">
              Documento <span className="text-red-500">*</span>
            </Label>
            <Input
              id="documento"
              type="text"
              placeholder="Número de documento"
              value={formData.documento}
              onChange={(e) => handleInputChange("documento", e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Correo y Teléfono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="correo" className="text-sm font-medium">
                Correo Electrónico <span className="text-red-500">*</span>
              </Label>
              <Input
                id="correo"
                type="email"
                placeholder="ejemplo@correo.com"
                value={formData.correo}
                onChange={(e) => handleInputChange("correo", e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-sm font-medium">
                Teléfono
              </Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="3001234567"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>
          </div>

          {/* Ficha y Materia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ficha" className="text-sm font-medium">
                Ficha <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.ficha}
                onValueChange={(value) => handleInputChange("ficha", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una ficha" />
                </SelectTrigger>
                <SelectContent>
                  {fichas.map((ficha) => (
                    <SelectItem key={ficha} value={ficha}>
                      {ficha}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="materia" className="text-sm font-medium">
                Materia <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.materia}
                onValueChange={(value) => handleInputChange("materia", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una materia" />
                </SelectTrigger>
                <SelectContent>
                  {materias.map((materia) => (
                    <SelectItem key={materia} value={materia}>
                      {materia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Nota:</strong> El docente será creado con acceso al
              sistema. Se recomienda verificar todos los datos antes de
              guardar.
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    ⏳
                  </motion.div>
                  Creando...
                </span>
              ) : (
                "Crear Docente"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}