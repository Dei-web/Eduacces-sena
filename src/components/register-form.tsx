"use client";

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

import { useState } from "react";
import { createPersona } from "@/api/PersonApi";
import { IPersona } from "@/types/Person";
import { useRouter } from "next/navigation";

export function RegisterForm({ className }: React.ComponentProps<"form">) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    correo: "",
    telefono: "",
    id_rol: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, id_rol: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const persona: IPersona & { password: string } = {
      id_persona: 0,
      nombre: formData.nombre,
      apellido: formData.apellido,
      documento: formData.documento,
      correo: formData.correo,
      telefono: formData.telefono,
      id_rol: Number(formData.id_rol),
      password: formData.password,
    };

    try {
      const res = await createPersona(persona);
      console.log("Persona creada:", res);
      router.push("/dashboard");
    } catch (err) {
      console.error("Error al crear persona:", err);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to create an account
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="nombre">First Name</Label>
          <Input
            id="nombre"
            type="text"
            placeholder="Juan"
            required
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="apellido">Last Name</Label>
          <Input
            id="apellido"
            type="text"
            placeholder="Pérez"
            required
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="documento">Document ID</Label>
          <Input
            id="documento"
            type="text"
            placeholder="12345678"
            required
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="correo">Email</Label>
          <Input
            id="correo"
            type="email"
            placeholder="juan@mail.com"
            required
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="telefono">Phone</Label>
          <Input
            id="telefono"
            type="text"
            placeholder="3001234567"
            required
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="rol">Role</Label>
          <Select
            className="w-full"
            value={formData.id_rol}
            onValueChange={handleSelectChange}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Admin</SelectItem>
              <SelectItem value="2">Student</SelectItem>
              <SelectItem value="3">Teacher</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            onChange={handleChange}
          />
        </div>

        <Button
          type="submit"
          className="bg-green-300 w-full hover:bg-green-400"
        >
          Register
        </Button>
      </div>

      <div className="text-center text-sm">
        Do you have an account?{" "}
        <a href="/auth/login" className="underline underline-offset-4">
          Sign in
        </a>
      </div>
    </form>
  );
}
