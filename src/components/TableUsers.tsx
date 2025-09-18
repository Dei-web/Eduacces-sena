"use client";

import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, Button, Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUsers, deleteUser } from "@/api/UserApi";
import { IUsers } from "@/types/user";
import CreateUserModal from "@/components/modalCreateUser";
import UpdateUserModal from "@/components/modalUpdateUser";

export default function UsersTable() {
  const [data, setData] = useState<IUsers[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUsers | null>(null);

  const fetchUsers = async () => {
    const users = await getUsers();
    setData(users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: IUsers) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const handleDelete = async (user: IUsers) => {
    if (confirm(`¿Seguro que deseas eliminar a ${user.id_user}?`)) {
      await deleteUser(user.id_user);
      fetchUsers();
    }
  };

  const columns = useMemo<MRT_ColumnDef<IUsers>[]>(
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
              alt={row.original.persona}
            />
          );
        },
      },
      {
        accessorKey: "correo",
        header: "Correo",
        size: 200,
        enableClickToCopy: true,
      },
      {
        accessorKey: "persona",
        header: "Nombre",
        size: 150,
      },
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
        renderTopToolbarCustomActions={() => (
          <Button
            variant="contained"
            color="success"
            onClick={() => setOpenCreate(true)}
            startIcon={<AddIcon />}
          >
            Crear Usuario
          </Button>
        )}
      />

      {/* Modal editar usuario */}
      <UpdateUserModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={selectedUser}
        onUpdated={fetchUsers}
      />

      {/* Modal crear usuario */}
      <CreateUserModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={fetchUsers}
      />
    </>
  );
}
