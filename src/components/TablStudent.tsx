"use client";
import Swal from "sweetalert2";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@/components/ui/button";
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

  const handleDelete = async (persona: IPersona) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará a ${persona.nombre}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deletePersona(persona.id_persona);
        await fetchPersonas();

        Swal.fire({
          title: "Eliminado",
          text: `${persona.nombre} fue eliminado correctamente`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el registro",
          icon: "error",
        });
      }
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
              className=" bg-green-400 hover:bg-green-700"
              variant="default"
              onClick={() => handleEdit(row.original)}
            >
              <motion.div
                whileHover={{ y: -3 }}
                whileTap={{ rotate: -15 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <EditIcon fontSize="small" />
              </motion.div>
            </Button>

            <Button
              variant="destructive"
              onClick={() => handleDelete(row.original)}
            >
              <motion.div
                whileTap={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DeleteIcon fontSize="small" />
              </motion.div>
            </Button>

            <Button
              variant="default"
              onClick={() => {
                setOpenEnroll(true);
                setPersonaId(row.original.id_persona);
              }}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5, color: "#fff" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Fingerprint />
              </motion.div>
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
              className="bg-green-400 hover:bg-green-600 rounded-2xl"
              variant="default"
              onClick={() => router.push("/auth/register")}
            >
              <AddIcon fontSize="small" />
              create User
            </Button>
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
