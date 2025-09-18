import { SiteHeader } from "@/components/header-dash";

export default function HuellaHome() {
  return (
    <>
      <div className="flex flex-1 flex-col">
        <SiteHeader title="Header-huella" />
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6"></div>
          </div>
        </div>
      </div>
    </>
  );
}
