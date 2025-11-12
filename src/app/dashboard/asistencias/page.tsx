"use client";

import { SiteHeader } from "@/components/header-dash";
import AsistenciaComponent from "@/components/asistencia";

export default function Personas() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader title="Dashboard" />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            {/* Aquí puedes agregar un título opcional */}
            <h2 className="text-2xl font-bold mb-4">Control de Asistencia</h2>
          </div>
          <div className="px-4 lg:px-6">
            {/* Componente de asistencia */}
            <AsistenciaComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
