// app/huellas/page.tsx
"use client";

import { SiteHeader } from "@/components/header-dash";
import HuellaManagementTable from "@/components/gestionHuella";

export default function HuellasPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader title="Gestión de Huellas" />
      <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        {/* Tabla de huellas */}
        <div className="px-4 lg:px-6">
          <HuellaManagementTable />
        </div>
      </div>
    </div>
  );
}
