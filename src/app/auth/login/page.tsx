"use client";
import Swal from "sweetalert2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginForm } from "@/components/login-form";
import { loginUser } from "@/api/loginAunt";
import { useUser } from "@/context/userprop";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    Swal.fire({
      title: "Iniciando sesión...",
      text: "Por favor espera",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const data = await loginUser(email, password);
      setUser(data.user, data.token);
      Swal.close(); // cierra el loading

      Swal.fire({
        title: "¡Bienvenido!",
        text: `Usuario ${data.user.nombre} `,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      if (data.user.rol === "directora") {
        setTimeout(() => router.push("/dashboard"), 1200);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(errorMessage);
      Swal.close();

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Reintentar",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <ThemeToggle className="rounded-3xl" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm
              email={email}
              password={password}
              onEmailChange={(e) => setEmail(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onSubmit={handleSubmit}
            />
            {loading && (
              <p className="text-sm text-center mt-2 text-gray-600">
                Logging in...
              </p>
            )}
            {error && (
              <p className="text-sm text-center mt-2 text-red-500">{error}</p>
            )}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/tecnologia.jpg"
          alt="Technology background"
          fill
          className="object-cover dark:brightness-[0.5]"
          priority
          sizes="(max-width: 1024px) 0vw, 50vw"
        />
      </div>
    </div>
  );
}
