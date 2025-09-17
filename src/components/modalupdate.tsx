"use client";

import { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { getPersonas, updatePersona } from "@/api/PersonApi";
import { IPersona } from "@/types/persona";

interface EditPersonaModalProps {
  open: boolean;
  onClose: () => void;
  personaId: number | null;
  onUpdated: () => void;
}

export default function EditPersonaModal({
  open,
  onClose,
  personaId,
  onUpdated,
}: EditPersonaModalProps) {
  const [formData, setFormData] = useState<Partial<IPersona>>({});

  useEffect(() => {
    if (open && personaId) {
      getPersonas().then((personas) => {
        const persona = personas.find((p) => p.id_persona === personaId);
        if (persona) setFormData(persona);
      });
    }
  }, [open, personaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!personaId) return;

    const updateData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      documento: formData.documento,
      correo: formData.correo,
      telefono: formData.telefono,
    };

    await updatePersona(personaId, updateData);
    onUpdated();
    onClose();
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
          Editar Persona
        </Typography>
        <TextField
          id="nombre"
          label="Nombre"
          fullWidth
          value={formData.nombre || ""}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          id="apellido"
          label="Apellido"
          fullWidth
          value={formData.apellido || ""}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          id="documento"
          label="Documento"
          fullWidth
          value={formData.documento || ""}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          id="correo"
          label="Correo"
          fullWidth
          value={formData.correo || ""}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          id="telefono"
          label="Teléfono"
          fullWidth
          value={formData.telefono || ""}
          onChange={handleChange}
          margin="normal"
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
