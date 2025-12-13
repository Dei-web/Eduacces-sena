"use client";

import React, { useState, useEffect } from "react";

interface Persona {
  id_persona: number;
  documento: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  rol: string;
}

interface Carrera {
  nombre: string;
  descripcion: string;
}

interface Ficha {
  id_ficha: number;
  numero_ficha: string;
  carrera?: Carrera;
}

interface Asignacion {
  id_estudiante_ficha?: number;
  ficha: {
    numero_ficha: string;
    carrera: {
      nombre: string;
      descripcion: string;
    };
  };
  persona: {
    documento: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
  };
}

interface FormData {
  id_persona: string;
  id_ficha: string;
}

const AsignarEstudianteFicha: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Persona[]>([]);
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);

  const [formData, setFormData] = useState<FormData>({
    id_persona: "",
    id_ficha: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "success" | "error" | "";
    texto: string;
  }>({
    tipo: "",
    texto: "",
  });

  // Función para obtener el header de autenticación
  const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    cargarEstudiantes();
    cargarFichas();
    cargarAsignaciones();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      const response = await fetch("http://localhost:3000/persona", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar personas");
      }

      const data: Persona[] = await response.json();

      // Filtrar solo las personas con rol de estudiante
      const personasEstudiantes = data.filter(
        (persona) => persona.rol === "estudiante",
      );

      setEstudiantes(personasEstudiantes);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      mostrarMensaje("error", "Error al cargar la lista de estudiantes");
    }
  };

  const cargarFichas = async () => {
    try {
      const response = await fetch("http://localhost:3000/fichas", {
        headers: {
          ...getAuthHeader(),
        },
      });
      const data = await response.json();
      setFichas(data);
    } catch (error) {
      console.error("Error al cargar fichas:", error);
      mostrarMensaje("error", "Error al cargar la lista de fichas");
    }
  };

  const cargarAsignaciones = async () => {
    try {
      const response = await fetch("http://localhost:3000/estudiante-ficha", {
        headers: {
          ...getAuthHeader(),
        },
      });
      const data = await response.json();
      setAsignaciones(data);
    } catch (error) {
      console.error("Error al cargar asignaciones:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.id_persona || !formData.id_ficha) {
      mostrarMensaje("error", "Por favor, complete todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/estudiante-ficha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          id_persona: parseInt(formData.id_persona),
          id_ficha: parseInt(formData.id_ficha),
        }),
      });

      if (response.ok) {
        mostrarMensaje("success", "¡Estudiante asignado exitosamente!");
        setFormData({
          id_persona: "",
          id_ficha: "",
        });
        cargarAsignaciones();
      } else {
        const error = await response.json();
        mostrarMensaje(
          "error",
          error.message || "Error al asignar el estudiante",
        );
      }
    } catch (error) {
      console.error("Error:", error);
      mostrarMensaje("error", "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (idAsignacion: number | undefined) => {
    if (!idAsignacion) {
      mostrarMensaje(
        "error",
        "No se puede eliminar: ID de asignación no válido",
      );
      return;
    }

    if (!window.confirm("¿Está seguro de eliminar esta asignación?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/estudiante-ficha/${idAsignacion}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        },
      );

      if (response.ok) {
        mostrarMensaje("success", "Asignación eliminada exitosamente");
        cargarAsignaciones();
      } else {
        const error = await response.json().catch(() => ({}));
        mostrarMensaje(
          "error",
          error.message || "Error al eliminar la asignación",
        );
      }
    } catch (error) {
      console.error("Error:", error);
      mostrarMensaje("error", "Error al conectar con el servidor");
    }
  };

  const mostrarMensaje = (tipo: "success" | "error", texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => {
      setMensaje({ tipo: "", texto: "" });
    }, 5000);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Formulario de asignación */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b-4 border-green-500">
          Asignar Estudiante a Ficha
        </h2>

        {mensaje.texto && (
          <div
            className={`mb-6 p-4 rounded-lg font-medium ${
              mensaje.tipo === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label
              htmlFor="id_persona"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Estudiante:
            </label>
            <select
              id="id_persona"
              name="id_persona"
              value={formData.id_persona}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white"
              required
            >
              <option value="">Seleccione un estudiante</option>
              {estudiantes.map((estudiante) => (
                <option
                  key={estudiante.id_persona}
                  value={estudiante.id_persona}
                >
                  {estudiante.nombre} {estudiante.apellido} -{" "}
                  {estudiante.documento}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="id_ficha"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Ficha:
            </label>
            <select
              id="id_ficha"
              name="id_ficha"
              value={formData.id_ficha}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white"
              required
            >
              <option value="">Seleccione una ficha</option>
              {fichas.map((ficha) => (
                <option key={ficha.id_ficha} value={ficha.id_ficha}>
                  {ficha.numero_ficha} -{" "}
                  {ficha.carrera?.nombre || "Sin carrera"}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? "Asignando..." : "Asignar Estudiante"}
          </button>
        </div>
      </div>

      {/* Tabla de asignaciones */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Asignaciones Actuales
        </h3>

        {asignaciones.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No hay asignaciones registradas
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ficha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrera
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {asignaciones.map((asignacion, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {asignacion.persona?.nombre}{" "}
                        {asignacion.persona?.apellido}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {asignacion.persona?.documento}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {asignacion.persona?.correo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {asignacion.persona?.telefono}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {asignacion.ficha?.numero_ficha}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {asignacion.ficha?.carrera?.nombre}
                      </div>
                      <div className="text-xs text-gray-500">
                        {asignacion.ficha?.carrera?.descripcion}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() =>
                          handleEliminar(asignacion.id_estudiante_ficha)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                        title="Eliminar asignación"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AsignarEstudianteFicha;
