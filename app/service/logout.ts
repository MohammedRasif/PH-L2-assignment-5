"use server"

import { cookies } from "next/headers";

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
