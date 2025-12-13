import { Card } from "./ui/card";
import { MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

interface Metrics {
  estudiantes: number;
  profesores: number;
  carreras: number;
  fichas: number;
}

export default function PrincipalCardWelcome() {
  const [metrics, setMetrics] = useState<Metrics>({
    estudiantes: 0,
    profesores: 0,
    carreras: 0,
    fichas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Obtén el token del localStorage (o donde lo guardes)
        const token = localStorage.getItem("token"); // Ajusta según dónde guardes el token

        if (!token) {
          console.error("No hay token de autenticación");
          setLoading(false);
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [estudiantesRes, docentesRes, carrerasRes, fichasRes] =
          await Promise.all([
            fetch("http://localhost:3000/estudiante-ficha/metrics", {
              headers,
            }),
            fetch("http://localhost:3000/docente-ficha/metrics", { headers }),
            fetch("http://localhost:3000/carreras/metrics", { headers }),
            fetch("http://localhost:3000/fichas/metrics", { headers }),
          ]);

        const [estudiantesData, profesoresData, carrerasData, fichasData] =
          await Promise.all([
            estudiantesRes.json(),
            docentesRes.json(),
            carrerasRes.json(),
            fichasRes.json(),
          ]);

        // Debug: ver qué está llegando
        console.log("Estudiantes:", estudiantesData);
        console.log("Profesores:", profesoresData);
        console.log("Carreras:", carrerasData);
        console.log("Fichas:", fichasData);

        setMetrics({
          estudiantes: estudiantesData?.data?.count || 0,
          profesores: profesoresData?.data?.count || 0,
          carreras: carrerasData?.data?.count || 0,
          fichas: fichasData?.data?.count || 0,
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-full">
      {/* Card 1 - Students */}
      <Card className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="flex items-start justify-between mb-6">
          <div className="text-sm font-medium text-gray-600">Alumnos</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-gray-100"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
        <div className="text-4xl font-bold text-gray-900">
          {loading ? "..." : metrics.estudiantes.toLocaleString()}
        </div>
      </Card>

      {/* Card 2 - Teachers */}
      <Card className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="flex items-start justify-between mb-6">
          <div className="text-sm font-medium text-gray-600">Profesores</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-gray-100"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
        <div className="text-4xl font-bold text-gray-900">
          {loading ? "..." : metrics.profesores.toLocaleString()}
        </div>
      </Card>

      {/* Card 3 - Careers */}
      <Card className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="flex items-start justify-between mb-6">
          <div className="text-sm font-medium text-gray-600">Carreras</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-gray-100"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
        <div className="text-4xl font-bold text-gray-900">
          {loading ? "..." : metrics.carreras.toLocaleString()}
        </div>
      </Card>

      {/* Card 4 - Fichas */}
      <Card className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="flex items-start justify-between mb-6">
          <div className="text-sm font-medium text-gray-600">Fichas</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-gray-100"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
        <div className="text-4xl font-bold text-gray-900">
          {loading ? "..." : metrics.fichas.toLocaleString()}
        </div>
      </Card>
    </div>
  );
}
