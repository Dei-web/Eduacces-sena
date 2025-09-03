import { Recover } from "@/components/recover";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <>
      <ThemeToggle className="absolute m-10 rounded-3xl" />
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Recover />
        </div>
      </div>
    </>
  );
}
