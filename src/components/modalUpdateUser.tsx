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
import { updateUser } from "@/api/UserApi";
import { IUsers } from "@/types/user";
import { IPersona } from "@/types/persona";
import { getPersonas } from "@/api/PersonApi";

interface UpdateUserModalProps {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  user: IUsers | null;
}

export default function UpdateUserModal({
  open,
  onClose,
  onUpdated,
  user,
}: UpdateUserModalProps) {
  const [formData, setFormData] = useState({
    correo: "",
    id_persona: 0,
  });

  const [personas, setPersonas] = useState<IPersona[]>([]);

  // Cargar personas cuando se abre el modal
  useEffect(() => {
    if (open) {
      getPersonas().then(setPersonas);
    }
  }, [open]);

  // Actualizar formulario cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setFormData({
        correo: user.correo,
        id_persona: user.id_persona,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "id_persona" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.correo || !formData.id_persona || !user) return;

    try {
      await updateUser(user.id_user, formData);
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
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
          Editar Usuario
        </Typography>

        {/* Correo */}
        <TextField
          id="correo"
          label="Correo"
          fullWidth
          value={formData.correo}
          onChange={handleChange}
          margin="normal"
        />

        {/* Persona */}
        <TextField
          id="id_persona"
          select
          label="Persona"
          fullWidth
          value={formData.id_persona || ""}
          onChange={handleChange}
          margin="normal"
        >
          {personas.map((p) => (
            <MenuItem key={p.id_persona} value={p.id_persona}>
              {p.nombre} {p.apellido} - {p.documento}
            </MenuItem>
          ))}
        </TextField>

        {/* Botones */}
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar cambios
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
