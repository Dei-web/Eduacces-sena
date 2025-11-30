"use client";
import { SiteHeader } from "@/components/header-dash";
import PrincipalCardWelcome from "@/components/card-principal";
import { ChartBarInteractive } from "@/components/charttets";
export default function Dashboard() {
  return (
    <>
      <div className="flex flex-1 flex-col">
        <SiteHeader title="Dashboard" />
        <div className="@container/main flex flex-1 flex-col gap-2 p-4 md:p-6">
          <PrincipalCardWelcome />
        </div>
        <div className="@container/main flex flex-1 flex-col gap-2 p-4 md:p-6">
          <ChartBarInteractive />
        </div>
      </div>
    </>
  );
}
