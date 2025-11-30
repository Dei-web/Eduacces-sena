import { SiteHeader } from "@/components/header-dash";
import CarrerasManager from "@/components/carreras";
export default function Dashboard() {
  return (
    <>
      <div className="flex flex-1 flex-col">
        <SiteHeader title="jj" />
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">{/* <h1>hola</h1> */}</div>
            <div className="px-4 lg:px-6">
              <CarrerasManager />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
