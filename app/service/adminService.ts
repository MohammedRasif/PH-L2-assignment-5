import { cookies } from "next/headers";

async function getAdminHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return {
    Authorization: token || "",
    "Content-Type": "application/json",
  };
}

export async function getAdminUsers() {
  const baseUrl = process.env.BACKEND_API_URL || "";
  const url = baseUrl.endsWith("/") ? `${baseUrl}api/admin/users` : `${baseUrl}/api/admin/users`;
  const headers = await getAdminHeader();

  const response = await fetch(url, {
    headers,
    cache: "no-store", // Always fetch fresh user data
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin users");
  }

  const result = await response.json();
  return result.data || [];
}

export async function getAdminProperties() {
  const baseUrl = process.env.BACKEND_API_URL || "";
  const url = baseUrl.endsWith("/") ? `${baseUrl}api/admin/properties` : `${baseUrl}/api/admin/properties`;
  const headers = await getAdminHeader();

  const response = await fetch(url, {
    headers,
    cache: "no-store", // Always fetch fresh properties list
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin properties");
  }

  const result = await response.json();
  return result.data || [];
}

export async function getAdminRentals() {
  const baseUrl = process.env.BACKEND_API_URL || "";
  const url = baseUrl.endsWith("/") ? `${baseUrl}api/admin/rentals` : `${baseUrl}/api/admin/rentals`;
  const headers = await getAdminHeader();

  const response = await fetch(url, {
    headers,
    cache: "no-store", // Always fetch fresh rental requests list
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin rentals");
  }

  const result = await response.json();
  return result.data || [];
}
