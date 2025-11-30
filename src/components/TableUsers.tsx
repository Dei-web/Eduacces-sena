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
  GripVertical,
  Mail,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import Swal from "sweetalert2";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Modals
import CreateUserModal from "@/components/modalCreateUser";
import UpdateUserModal from "@/components/modalUpdateUser";

// API
import { getUsers, deleteUser } from "@/api/UserApi";
import { IUsers } from "@/types/User";

interface TableRowProps {
  user: IUsers;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onEdit: (user: IUsers) => void;
  onDelete: (user: IUsers) => void;
}

const TableRow: React.FC<TableRowProps> = ({
  user,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
}) => {
  const avatarId = user.id_user % 70 || 1;

  // Obtener iniciales del nombre
  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
          onCheckedChange={() => onToggleSelect(user.id_user)}
          aria-label={`Select ${user.persona}`}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 flex-shrink-0 text-gray-300" />
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://i.pravatar.cc/150?img=${avatarId}`}
              alt={user.persona}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {getInitials(user.persona)}
            </AvatarFallback>
          </Avatar>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-900">
              {user.persona}
            </span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{user.correo}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        {!user.estado ? (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 hover:bg-green-100"
          >
            Activo
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-800 hover:bg-red-100"
          >
            Inactivo
          </Badge>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-green-200 hover:bg-green-50"
            onClick={() => onEdit(user)}
          >
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ rotate: -15 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Edit className="h-4 w-4 text-green-600" />
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
              <DropdownMenuItem onClick={() => onEdit(user)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(user)}
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
  const [data, setData] = useState<IUsers[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUsers | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const users = await getUsers();

      const sorted = users.sort((a, b) => {
        return Number(a.estado) - Number(b.estado);
      });

      setData(sorted);
    } catch {
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los usuarios",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.correo.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [data, searchTerm]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  const handleEdit = (user: IUsers) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const handleDelete = async (user: IUsers) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará a ${user.persona}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(user.id_user);
        await fetchUsers();

        Swal.fire({
          title: "Eliminado",
          text: `${user.persona} fue eliminado correctamente`,
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

  const handleToggleSelectAll = () => {
    if (selected.size === paginatedData.length && paginatedData.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginatedData.map((u) => u.id_user)));
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
              Gestiona los usuarios del sistema
            </p>
          </div>
          <Button
            className="gap-2 bg-green-500 hover:bg-green-600"
            onClick={() => setOpenCreate(true)}
          >
            <Plus className="h-4 w-4" />
            Crear Usuario
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
                    placeholder="Buscar por nombre o correo..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="pl-10"
                  />
                </div>
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
                    Nombre
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Correo
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Estado
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
              {paginatedData.length > 0 ? (
                paginatedData.map((user) => (
                  <TableRow
                    key={user.id_user}
                    user={user}
                    isSelected={selected.has(user.id_user)}
                    onToggleSelect={handleToggleSelect}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with selection count and pagination */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {selected.size} de {filteredData.length} seleccionados
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
              {totalPages > 0 ? currentPage + 1 : 0} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1 || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage === totalPages - 1 || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UpdateUserModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelectedUser(null);
        }}
        user={selectedUser!}
        onUpdated={fetchUsers}
      />

      <CreateUserModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={fetchUsers}
      />
    </div>
  );
}
