import { IUser } from "@/types/user";

const BASE_URL = "http://localhost:3000/user";

export async function getUsers(): Promise<IUser[]> {
  const res = await fetch(BASE_URL, { credentials: "include" });
  return res.json();
}

export async function getUser(id: number): Promise<IUser> {
  const res = await fetch(`${BASE_URL}/${id}`, { credentials: "include" });
  return res.json();
}

export async function createUser(user: IUser) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(user),
  });
  return res.json();
}

export async function updateUser(id: number, user: IUser) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(user),
  });
  return res.json();
}

export async function deleteUser(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}
