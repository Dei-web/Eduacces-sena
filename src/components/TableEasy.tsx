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
import data from "@/api/Data";
import { IUser } from "@/types/User";
// import { Avatar } from "@/components/ui/avatar";
import { Avatar } from "@mui/material";

export default function UsersTable() {
  const columns = useMemo<MRT_ColumnDef<IUsers>[]>(
    () => [
      {
        id: "perfil",
        header: "Perfiles",
        size: 100,
        Cell: ({ row }) => (
          <Avatar
            src={`https://i.pravatar.cc/150?img=${row.original.id}`}
            alt={row.original.name}
          />
        ),
      },

      { accessorFn: (row) => row.id, header: "los id", size: 80 },
      {
        accessorFn: (row) => `${row.name}\n ${row.email}`,
        header: "los nomnres mas Correo",
        size: 150,
      },
      { accessorKey: "name", header: "Nombre", size: 200 },
      {
        accessorKey: "email",
        header: "Correo",
        size: 250,
        enableClickToCopy: true,
      },
      { accessorKey: "rol", header: "Rol", size: 150 },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnOrdering: true,
    enableColumnActions: false,
    enableRowSelection: true,
    initialState: {
      showGlobalFilter: true,
      pagination: { pageSize: 5 },
      columnPinning: {
        left: ["mrt-row-select"],
      },
    },
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
