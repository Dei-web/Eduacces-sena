"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { IconReport, IconFileTypeCsv, IconDownload } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AttendanceData {
  id_persona: number;
  documento: string;
  nombre_completo: string;
  numero_ficha: string;
  nombre_carrera: string;
  total_asistencias: number;
  asistencias_presentes: number;
  asistencias_ausentes: number;
  asistencias_tardanzas: number;
  porcentaje_asistencia: number;
}

interface Quarter {
  value: string;
  label: string;
}

export function TestReport() {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const years: string[] = ["2023", "2024", "2025"];
  const quarters: Quarter[] = [
    { value: "T1", label: "Trimestre 1 (Enero - Marzo)" },
    { value: "T2", label: "Trimestre 2 (Abril - Junio)" },
    { value: "T3", label: "Trimestre 3 (Julio - Septiembre)" },
    { value: "T4", label: "Trimestre 4 (Octubre - Diciembre)" },
  ];

  const fetchAttendanceData = async (): Promise<AttendanceData[]> => {
    // TODO: Reemplazar con el endpoint real
    const endpoint = `/api/estudiantes/asistencias?year=${selectedYear}&trimestre=${selectedQuarter}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Error al obtener datos");

      const data: AttendanceData[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching attendance:", error);
      // Datos de ejemplo para demostración
      return [
        {
          id_persona: 1,
          documento: "1001234567",
          nombre_completo: "Ana Martínez López",
          numero_ficha: "2024-001",
          nombre_carrera: "Análisis y Desarrollo de Software",
          total_asistencias: 65,
          asistencias_presentes: 58,
          asistencias_ausentes: 5,
          asistencias_tardanzas: 2,
          porcentaje_asistencia: 89.23,
        },
        {
          id_persona: 2,
          documento: "1001234568",
          nombre_completo: "Carlos Rodríguez García",
          numero_ficha: "2024-001",
          nombre_carrera: "Análisis y Desarrollo de Software",
          total_asistencias: 65,
          asistencias_presentes: 63,
          asistencias_ausentes: 2,
          asistencias_tardanzas: 0,
          porcentaje_asistencia: 96.92,
        },
        {
          id_persona: 3,
          documento: "1001234569",
          nombre_completo: "Laura González Pérez",
          numero_ficha: "2024-002",
          nombre_carrera: "Diseño Gráfico",
          total_asistencias: 65,
          asistencias_presentes: 60,
          asistencias_ausentes: 3,
          asistencias_tardanzas: 2,
          porcentaje_asistencia: 92.31,
        },
      ];
    }
  };

  const convertToCSV = (data: AttendanceData[]): string => {
    if (!data || data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(",");

    const csvRows = data.map((row: AttendanceData) =>
      headers
        .map((header: string) => {
          const value = row[header as keyof AttendanceData];
          // Escapar valores que contengan comas o comillas
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(","),
    );

    return [csvHeaders, ...csvRows].join("\n");
  };

  const downloadCSV = (csvContent: string, filename: string): void => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = async (): Promise<void> => {
    if (!selectedYear || !selectedQuarter) {
      alert("Por favor seleccione año y trimestre");
      return;
    }

    setIsLoading(true);

    try {
      const data = await fetchAttendanceData();
      const csvContent = convertToCSV(data);
      const filename = `asistencias_estudiantes_${selectedYear}_${selectedQuarter}_${new Date().getTime()}.csv`;

      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error("Error al exportar:", error);
      alert("Error al generar el reporte");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <IconReport className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl">Reportes de Asistencias</CardTitle>
        </div>
        <CardDescription>
          Genere y exporte reportes de asistencias por trimestre en formato CSV.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Año</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el año" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year: string) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Trimestre</label>
            <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el trimestre" />
              </SelectTrigger>
              <SelectContent>
                {quarters.map((quarter: Quarter) => (
                  <SelectItem key={quarter.value} value={quarter.value}>
                    {quarter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedYear && selectedQuarter && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Período seleccionado:</span>{" "}
              {selectedQuarter} del {selectedYear}
            </p>
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="flex flex-col gap-3 pt-6">
        <p className="text-sm text-muted-foreground text-center w-full">
          Seleccione los parámetros y luego genere el reporte.
        </p>

        <Button
          onClick={handleExportCSV}
          disabled={!selectedYear || !selectedQuarter || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <IconDownload className="mr-2 h-5 w-5 animate-spin" />
              Generando reporte...
            </>
          ) : (
            <>
              <IconFileTypeCsv className="mr-2 h-5 w-5" />
              Exportar CSV
            </>
          )}
        </Button>

        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md w-full">
          <p className="text-xs text-blue-800 font-mono break-all">
            <span className="font-semibold">Endpoint:</span>{" "}
            /api/estudiantes/asistencias?year={selectedYear || "{year}"}
            &trimestre={selectedQuarter || "{trimestre}"}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
