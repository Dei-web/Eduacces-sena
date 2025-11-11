"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { createUser } from "@/api/UserApi";
import { IPersona } from "@/types/Person";
import { getPersonas } from "@/api/PersonApi";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface CreateUserForm {
  correo: string;
  password: string;
  id_persona: number | null;
}

export default function CreateUserModal({
  open,
  onClose,
  onCreated,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState<CreateUserForm>({
    correo: "",
    password: "",
    id_persona: null,
  });

  const [personas, setPersonas] = useState<IPersona[]>([]);

  const loadPersonas = async () => {
    try {
      const data = await getPersonas();
      setPersonas(data);
    } catch (err) {
      console.error("Error cargando personas:", err);
    }
  };

  // reset y cargar personas cada vez que se abre
  useEffect(() => {
    if (open) {
      setFormData({ correo: "", password: "", id_persona: null });
      loadPersonas();
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name =
      (e.target as HTMLInputElement).name || (e.target as HTMLInputElement).id;
    const raw = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "id_persona" ? (raw === "" ? null : Number(raw)) : raw,
    }));
  };

  const handleSubmit = async () => {
    // validación simple
    if (!formData.correo || !formData.password || !formData.id_persona) {
      console.warn("Faltan campos obligatorios:", formData);
      return;
    }

    try {
      const res = await createUser({
        correo: formData.correo,
        password: formData.password,
        id_persona: formData.id_persona as number,
      });
      console.log("Respuesta del backend:", res);
      onCreated();
      onClose();
      setFormData({ correo: "", password: "", id_persona: null });
    } catch (err) {
      console.error("Error al crear usuario:", err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" mb={2}>
          Crear Usuario
        </Typography>

        <TextField
          id="correo"
          name="correo"
          label="Correo"
          fullWidth
          value={formData.correo}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          id="password"
          name="password"
          label="Contraseña"
          type="password"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          id="id_persona"
          name="id_persona"
          select
          label="Persona"
          fullWidth
          value={formData.id_persona ?? ""}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="">-- Selecciona --</MenuItem>
          {personas.map((p) => (
            <MenuItem key={p.id_persona} value={p.id_persona}>
              {p.nombre} {p.apellido} - {p.documento}
            </MenuItem>
          ))}
        </TextField>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={
              !formData.correo || !formData.password || !formData.id_persona
            }
          >
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
