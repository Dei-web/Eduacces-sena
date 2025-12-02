"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  MoreVertical,
  Search,
  Edit,
  Fingerprint,
  GripVertical,
} from "lucide-react";
import { motion } from "motion/react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Modals
import EnrollFingerprintModal from "@/components/EnrollFingerprintModal";
import EditPersonaModal from "@/components/modalupdate";

// API
import { getPersonas, deletePersona } from "@/api/PersonApi";
import { IPersona } from "@/types/Person";

// SweetAlert
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface TableRowProps {
  persona: IPersona;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onEdit: (persona: IPersona) => void;
  onDelete: (persona: IPersona) => void;
  onEnrollFingerprint: (persona: IPersona) => void;
}

const TableRow: React.FC<TableRowProps> = ({
  persona,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  onEnrollFingerprint,
}) => {
  const avatarId = parseInt(persona.documento.slice(-2)) % 70 || 1;

  const getRoleBadgeColor = (rol: string) => {
    const roleColors: Record<string, string> = {
      admin: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      usuario: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      empleado: "bg-green-100 text-green-800 hover:bg-green-100",
      gerente: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    };
    return roleColors[rol.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <tr
      className={`border-b border-gray-200 transition-colors hover:bg-gray-50 ${
        isSelected ? "bg-blue-50" : ""
      }`}
    >
      <td className="px-4 py-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(persona.id_persona)}
          aria-label={`Select ${persona.nombre}`}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 flex-shrink-0 text-gray-300" />
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://i.pravatar.cc/150?img=${avatarId}`}
              alt={persona.nombre}
            />
            <AvatarFallback>
              {persona.nombre.charAt(0)}
              {persona.apellido.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-gray-900">
          {persona.documento}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            {persona.nombre} {persona.apellido}
          </span>
          <span className="text-xs text-gray-500">{persona.correo}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-gray-600">{persona.telefono}</span>
      </td>
      <td className="px-4 py-3">
        <Badge variant="secondary" className={getRoleBadgeColor(persona.rol)}>
          {persona.rol}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-green-200 hover:bg-green-50"
            onClick={() => onEdit(persona)}
          >
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ rotate: -15 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Edit className="h-4 w-4 text-green-600" />
            </motion.div>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50"
            onClick={() => onEnrollFingerprint(persona)}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Fingerprint className="h-4 w-4 text-blue-600" />
            </motion.div>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-gray-200"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(persona)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(persona)}
                className="text-red-600 focus:text-red-600"
              >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
};

export default function UsersTable() {
  const router = useRouter();
  const [data, setData] = useState<IPersona[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openEnroll, setOpenEnroll] = useState(false);
  const [personaId, setPersonaId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  const fetchPersonas = async () => {
    const personas = await getPersonas();
    setData(personas);
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((persona) => {
      const matchesSearch =
        searchTerm === "" ||
        persona.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.documento.includes(searchTerm) ||
        persona.correo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || persona.rol === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [data, searchTerm, filterRole]);

  const roles = useMemo(
    () => [...new Set(data.map((persona) => persona.rol))],
    [data],
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

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
      } catch {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el registro",
          icon: "error",
        });
      }
    }
  };

  const handleEnrollFingerprint = (persona: IPersona) => {
    setPersonaId(persona.id_persona);
    setOpenEnroll(true);
  };

  const handleToggleSelectAll = () => {
    if (selected.size === paginatedData.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginatedData.map((p) => p.id_persona)));
    }
  };

  const handleToggleSelect = (id: number) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelected(newSet);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(0, Math.min(totalPages - 1, page)));
  };

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Usuarios</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona las personas del sistema
            </p>
          </div>
          <Button
            className="gap-2 bg-green-500 hover:bg-green-600"
            onClick={() => router.push("/auth/register")}
          >
            <Plus className="h-4 w-4" />
            Crear Persona
          </Button>
        </div>

        {/* Filters Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              {/* Search Input */}
              <div className="flex-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por nombre, documento o correo..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="w-full sm:w-48">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                  Rol
                </label>
                <Select
                  value={filterRole}
                  onValueChange={(value) => {
                    setFilterRole(value);
                    setCurrentPage(0);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 opacity-0">
                  Limpiar
                </label>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterRole("all");
                    setCurrentPage(0);
                  }}
                  className="w-full sm:w-auto"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={
                      selected.size === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onCheckedChange={handleToggleSelectAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Perfil
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Documento
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Nombre
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Teléfono
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Rol
                  </span>
                </th>
                <th className="px-4 py-3 text-right">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Acciones
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((persona) => (
                <TableRow
                  key={persona.id_persona}
                  persona={persona}
                  isSelected={selected.has(persona.id_persona)}
                  onToggleSelect={handleToggleSelect}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onEnrollFingerprint={handleEnrollFingerprint}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with selection count and pagination */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {selected.size} de {data.length} seleccionados
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm font-medium text-gray-700">
              {currentPage + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EnrollFingerprintModal
        isOpen={openEnroll}
        onClose={() => setOpenEnroll(false)}
        idPersona={personaId ?? 0}
        mode="enroll"
      />

      <EditPersonaModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        personaId={personaId}
        onUpdated={fetchPersonas}
      />
    </div>
  );
}
