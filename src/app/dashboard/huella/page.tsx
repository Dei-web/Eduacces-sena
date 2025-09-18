"use client";
import { SiteHeader } from "@/components/header-dash";
import dynamic from "next/dynamic";
const TT = dynamic(() => import("@/components/TableHuella"), {
  ssr: false,
});

export default function HuellaHome() {
  return (
    <>
      <div className="flex flex-1 flex-col">
        <SiteHeader title="Header-huella" />
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <TT />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
