import { IUsers } from "@/types/User";
import { IUserCreate } from "@/types/UserCreate";
import { IUserUpdateBody } from "@/types/UserUpdate";

const BASE_URL = "http://localhost:3000/user";

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getUsers(): Promise<IUsers[]> {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    } as HeadersInit,
  });

  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}

export async function getUser(id: number): Promise<IUsers> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    } as HeadersInit,
  });

  if (!res.ok) throw new Error("Error al obtener usuario");
  return res.json();
}

export async function createUser(user: IUserCreate): Promise<IUserCreate> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    } as HeadersInit,
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error al crear usuario");
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return null as unknown as IUserCreate; // si el backend no devuelve JSON
}

async function updateUser(id: number, user: IUserUpdateBody): Promise<IUsers> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    } as HeadersInit,
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error al actualizar usuario");
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return null as unknown as IUsers;
}

export async function deleteUser(id: number): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    } as HeadersInit,
  });

  if (!res.ok) throw new Error("Error al eliminar usuario");
  return res.json();
}

export { updateUser };
