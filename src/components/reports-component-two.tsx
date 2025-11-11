"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import {
  IconReport,
  IconFileTypeCsv,
  IconFileTypePdf,
} from "@tabler/icons-react";
import { ComboboxDemo } from "@/components/combo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function TestReport() {
  const frameworks = [
    { value: "next.js", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
  ];

  return (
    <Card className="@container/card border border-border/60 shadow-md transition-all hover:shadow-lg">
      <CardHeader className="flex flex-col items-start space-y-2">
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
          <IconReport className="text-primary" />
          <span>Reportes</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Genere y exporte sus reportes en diferentes formatos.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ComboboxDemo items={frameworks} />
          <ComboboxDemo items={frameworks} />
        </div>
        <Separator />
        <p className="text-sm text-muted-foreground">
          Seleccione los parámetros y luego el formato de exportación.
        </p>
      </CardContent>

      <CardFooter className="flex flex-row justify-end gap-3 pt-2">
        <Button
          variant="outline"
          className="flex items-center gap-2 border-primary/60 hover:bg-primary/10"
        >
          <IconFileTypeCsv className="w-4 h-4 text-primary" />
          Exportar CSV
        </Button>

        <Button className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 shadow-sm">
          <IconFileTypePdf className="w-4 h-4" />
          Exportar PDF
        </Button>
      </CardFooter>
    </Card>
  );
}
