"use client";

import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";

import { Box, Button, lighten } from "@mui/material";
import data from "@/api/Data2";
import { IUser } from "@/types/Student";
import { Avatar, Chip } from "@mui/material";

export default function UsersTable() {
  const columns = useMemo<MRT_ColumnDef<IStudent>[]>(
    () => [
      {
        id: "perfil",
        header: "Perfiles",
        size: 100,
        Cell: ({ row }) => {
          const avatarId = parseInt(row.original.cedula.slice(-2)) % 70 || 1;

          return (
            <Avatar
              src={`https://i.pravatar.cc/150?img=${avatarId}`}
              alt={row.original.nombre}
            />
          );
        },
      },

      { accessorFn: (row) => row.cedula, header: "Identificacion", size: 80 },
      { accessorKey: "nombre", header: "Nombre", size: 200 },
      { accessorKey: "apellido", header: "Apellido", size: 150 },
      {
        accessorKey: "estado",
        header: "Asistencia",
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();

          let color: "default" | "success" | "error" | "warning" = "default";
          let label = "";

          switch (value) {
            case "ESPERA":
              color = "warning";
              label = "En espera";
              break;
            case "LLEGO":
              color = "success";
              label = "Llegó";
              break;
            case "NO_VINO":
              color = "error";
              label = "No vino";
              break;
          }

          return <Chip label={label} color={color} variant="filled" />;
        },
      },
      { accessorKey: "ficha", header: "Ficha", size: 150 },

      {
        accessorKey: "correo",
        header: "Correo",
        size: 250,
        enableClickToCopy: true,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnOrdering: true,
    enableColumnActions: false,
    enableRowSelection: true,
    paginationDisplayMode: "pages",
    muiSearchTextFieldProps: {
      placeholder: "Buscar usuario",
      size: "small",
      variant: "outlined",
    },
    localization: {
      rowsPerPage: "Paginacion",
      of: "de",
    },
    muiPaginationProps: {
      color: "segundary",
      rowsPerPageOptions: [5, 10, 20, 30],
      shape: "rounded",
      variant: "outlined",
    },
  });

  return <MaterialReactTable table={table} />;
}
