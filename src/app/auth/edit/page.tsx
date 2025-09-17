"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPersona, updatePersona } from "@/api/PersonApi";
import { IPersona } from "@/types/persona";

import { cn } from "@/lib/utils";
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

export default function EditPersonaPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<IPersona>>({});

  useEffect(() => {
    if (id) {
      getPersona(Number(id)).then((data) => setFormData(data));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, id_rol: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePersona(Number(id), formData as IPersona);
    router.push("/dashboard");
  };

  if (!formData) return <p>Cargando...</p>;

  return (
    <form
      className={cn("flex flex-col gap-6 max-w-lg mx-auto mt-10")}
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold text-center">Editar Persona</h1>

      <div className="grid gap-3">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          type="text"
          value={formData.nombre || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="apellido">Apellido</Label>
        <Input
          id="apellido"
          type="text"
          value={formData.apellido || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="documento">Documento</Label>
        <Input
          id="documento"
          type="text"
          value={formData.documento || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="correo">Correo</Label>
        <Input
          id="correo"
          type="email"
          value={formData.correo || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input
          id="telefono"
          type="text"
          value={formData.telefono || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="id_rol">Rol</Label>
        <Select
          value={formData.id_rol ? String(formData.id_rol) : ""}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Directora</SelectItem>
            <SelectItem value="2">Instructor/Profesor</SelectItem>
            <SelectItem value="3">Estudiante</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="bg-blue-500 hover:bg-blue-600 w-full">
        Guardar cambios
      </Button>
    </form>
  );
}
