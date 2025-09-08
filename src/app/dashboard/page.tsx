"use client";
import { SiteHeader } from "@/components/header-dash";
import dynamic from "next/dynamic";
const TableRequest = dynamic(() => import("@/components/TableEasy"), {
  ssr: false,
});

export default function Dashboard() {
  return (
    <>
      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              {/* <h1>hola</h1> */}
              <TableRequest />
            </div>
            <div className="px-4 lg:px-6">
              {" "}
              <h1>hola2</h1>
              {/* <ChartBarMultiple /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
