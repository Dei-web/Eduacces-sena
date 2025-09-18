"use client";

import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, Button, Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Fingerprint } from "lucide-react";

import { enrollHuella, deleteEnrollHuella, HuellaGet } from "@/api/huellaApi";
import { IHuella } from "@/types/huella";
import EnrollFingerprintModal from "@/components/EnrollFingerprintModal";

export default function TableTable() {
  const [data, setData] = useState<IHuella[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUsers | null>(null);

  const fetchUsers = async () => {
    const users = await HuellaGet();
    setData(users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (user: IHuella) => {
    if (confirm(`¿Seguro que deseas eliminar a ${user.name}?`)) {
      await deleteEnrollHuella(user.id_persona);
      fetchUsers();
    }
  };

  const columns = useMemo<MRT_ColumnDef<IHuella>[]>(
    () => [
      {
        id: "perfil",
        header: "Perfil",
        size: 100,
        Cell: ({ row }) => {
          const avatarId = row.original.id_persona % 70 || 1;
          return (
            <Avatar
              src={`https://i.pravatar.cc/150?img=${avatarId}`}
              alt={row.original.name}
            />
          );
        },
      },
      {
        accessorKey: "id_sensor",
        header: "Id_seensor",
        size: 200,
      },
      { accessorKey: "persona", header: "Name", size: 120 },
      {
        id: "acciones",
        header: "Opciones",
        size: 200,
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
      />
    </>
  );
}
