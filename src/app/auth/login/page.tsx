"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

    try {
      const data = await loginUser(email, password);
      setUser(data.user, data.token);
      if (data.user.rol == "directora") {
        router.push("/dashboard");
      }
      console.log("Usuario logeado:", data.user);
      alert("user logeado");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
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
        <img
          src="/tecnologia.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5]"
        />
      </div>
    </div>
  );
}
