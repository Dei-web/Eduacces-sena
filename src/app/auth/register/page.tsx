import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/tecnologia.jpg"
          alt="Technology background"
          fill
          className="object-cover dark:brightness-[0.4]"
          priority
          sizes="(max-width: 1024px) 0vw, 50vw"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <ThemeToggle className="rounded-3xl" />
          <a href="#" className="flex items-center gap-2 font-medium">
            Here.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
