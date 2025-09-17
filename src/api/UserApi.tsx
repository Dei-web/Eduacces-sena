import { IUser } from "@/types/user";

const BASE_URL = "http://localhost:3000/user";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getUsers(): Promise<IUser[]> {
  const res = await fetch(BASE_URL, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return res.json();
}

export async function getUser(id: number): Promise<IUser> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return res.json();
}

export async function createUser(user: IUser) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(user),
  });
  return res.json();
}

export async function updateUser(id: number, user: IUser) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
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

  return null; // Para respuestas 204 o sin JSON
}

export async function deleteUser(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return res.json();
}
