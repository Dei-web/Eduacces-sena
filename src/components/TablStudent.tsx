"use client";

import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, Button, Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button as SecondaryButton } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";
import EnrollFingerprintModal from "@/components/EnrollFingerprintModal";
import { useRouter } from "next/navigation";
import { IPersona } from "@/types/Person";
import { getPersonas, deletePersona } from "@/api/PersonApi";
import EditPersonaModal from "@/components/modalupdate";

export default function UsersTable() {
  const router = useRouter();
  const [data, setData] = useState<IPersona[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openEnroll, setOpenEnroll] = useState(false);
  const [personaId, setPersonaId] = useState<number | null>(null);

  const fetchPersonas = async () => {
    const personas = await getPersonas();
    setData(personas);
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  const handleEdit = (persona: IPersona) => {
    setPersonaId(persona.id_persona);
    setOpenEdit(true);
  };

  const handleEnroll = () => {};

  const handleDelete = async (persona: IPersona) => {
    if (confirm(`¿Seguro que deseas eliminar a ${persona.nombre}?`)) {
      await deletePersona(persona.id_persona);
      fetchPersonas();
    }
  };

  const columns = useMemo<MRT_ColumnDef<IPersona>[]>(
    () => [
      {
        id: "perfil",
        header: "Perfiles",
        size: 100,
        Cell: ({ row }) => {
          const avatarId = parseInt(row.original.documento.slice(-2)) % 70 || 1;
          return (
            <Avatar
              src={`https://i.pravatar.cc/150?img=${avatarId}`}
              alt={row.original.nombre}
            />
          );
        },
      },
      { accessorKey: "documento", header: "Identificación", size: 100 },
      { accessorKey: "nombre", header: "Nombre", size: 150 },
      { accessorKey: "apellido", header: "Apellido", size: 150 },
      {
        accessorKey: "correo",
        header: "Correo",
        size: 200,
        enableClickToCopy: true,
      },
      { accessorKey: "telefono", header: "Teléfono", size: 150 },
      { accessorKey: "rol", header: "Rol", size: 150 },
      {
        id: "acciones",
        header: "Opciones",
        size: 220,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleEdit(row.original)}
            >
              <EditIcon fontSize="small" />
            </Button>

            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDelete(row.original)}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </Box>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <MaterialReactTable
        enableColumnOrdering
        enableRowOrdering
        columns={columns}
        data={data}
        paginationDisplayMode="pages"
        renderTopToolbarCustomActions={() => (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={() => router.push("/auth/register")}
            >
              <AddIcon fontSize="small" />
            </Button>

            <SecondaryButton
              variant="default"
              onClick={() => setOpenEnroll(true)}
            >
              <Fingerprint />
            </SecondaryButton>
          </>
        )}
      />
      <EnrollFingerprintModal
        isOpen={openEnroll}
        onClose={() => setOpenEnroll(false)}
        idPersona={personaId ?? 0}
      />

      <EditPersonaModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        personaId={personaId}
        onUpdated={fetchPersonas}
      />
    </>
  );
}
