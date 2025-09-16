"use client";

import { useMemo, useState, useEffect } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";

import { Box, Button, Avatar, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";

import { IPersona } from "@/types/persona";
import { getPersonas, deletePersona } from "@/api/PersonApi";

export default function UsersTable() {
  const router = useRouter();
  const [data, setData] = useState<IPersona[]>([]);

  // Cargar personas al iniciar
  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    const personas = await getPersonas();
    setData(personas);
  };

  const handleEdit = (persona: IPersona) => {
    console.log("Editar persona:", persona);
    // Aquí puedes redirigir a un form de edición
    router.push(`/persona/edit/${persona.id_persona}`);
  };

  const handleDelete = async (persona: IPersona) => {
    if (confirm(`¿Seguro que deseas eliminar a ${persona.nombre}?`)) {
      await deletePersona(persona.id_persona);
      // Recargar tabla
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
      {
        accessorFn: (row) => row.documento,
        header: "Identificación",
        size: 80,
      },
      { accessorKey: "nombre", header: "Nombre", size: 200 },
      { accessorKey: "apellido", header: "Apellido", size: 150 },
      {
        accessorKey: "correo",
        header: "Correo",
        size: 250,
        enableClickToCopy: true,
      },
      { accessorKey: "telefono", header: "Teléfono", size: 150 },
      { accessorKey: "id_rol", header: "Rol", size: 150 },
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

            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => router.push("/auth/register")}
            >
              Crear
            </Button>
          </Box>
        ),
      },
    ],
    [],
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableRowSelection
      paginationDisplayMode="pages"
    />
  );
}
