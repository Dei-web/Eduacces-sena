"use client";
import React, { useState } from "react";
import { SiteHeader } from "@/components/header-dash";
import AsignarDocenteFicha from "@/components/asignar";
import AsignarEstudianteFicha from "@/components/asignarestudiante";
import { SidebarInset } from "@/components/ui/sidebar";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"docente" | "estudiante">(
    "docente",
  );

  return (
    <SidebarInset>
      <SiteHeader title="Asignaciones" />

      <div className="flex flex-1 flex-col">
        {/* 🔹 Tabs */}
        <div className="flex border-b border-gray-300 px-4">
          <button
            className={`py-2 px-4 ${
              activeTab === "docente"
                ? "border-b-2 border-blue-500 font-semibold"
                : ""
            }`}
            onClick={() => setActiveTab("docente")}
          >
            Asignar Docente
          </button>

          <button
            className={`py-2 px-4 ${
              activeTab === "estudiante"
                ? "border-b-2 border-blue-500 font-semibold"
                : ""
            }`}
            onClick={() => setActiveTab("estudiante")}
          >
            Asignar Estudiante
          </button>
        </div>

        {/* 🔹 Contenido del tab */}
        <div className="@container/main flex flex-1 flex-col p-4">
          {activeTab === "docente" && (
            <div className="px-4 lg:px-2">
              <AsignarDocenteFicha />
            </div>
          )}

          {activeTab === "estudiante" && (
            <div className="px-4 lg:px-2">
              <AsignarEstudianteFicha />
            </div>
          )}
        </div>
      </div>
    </SidebarInset>
  );
}
