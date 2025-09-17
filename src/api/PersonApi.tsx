import { IPersona } from "@/types/persona";

const BASE_URL = "http://localhost:3000/persona";

function getAuthHeader() {
  const token = localStorage.getItem("token"); // o desde useUser()
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPersonas(): Promise<IPersona[]> {
  const res = await fetch(BASE_URL, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return res.json();
}

export async function getPersona(id: number): Promise<IPersona> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return res.json();
}

export async function createPersona(persona: IPersona) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(persona),
  });
  return res.json();
}

export async function updatePersona(id: number, persona: IPersona) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(persona),
  });
  return res.json();
}

export async function deletePersona(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return res.json();
}
