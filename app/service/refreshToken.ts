import { cookies } from "next/headers";

export function isTokenExpired(token: string | undefined | null): boolean {
  if (!token) return true;
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return true;
    const decodedJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
    const payload = JSON.parse(decodedJson);
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now() + 10000;
  } catch {
    return true;
  }
}


export async function tryRefreshToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken || isTokenExpired(refreshToken)) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      return null;
    }

    const rawBaseUrl = process.env.BACKEND_API_URL || "";
    const baseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;

    const response = await fetch(`${baseUrl}api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
        Authorization: refreshToken,
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      return null;
    }

    const data = await response.json();

    if (data?.success && data?.data?.accessToken) {
      const newAccessToken = data.data.accessToken;
      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });
      return newAccessToken;
    } else {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      return null;
    }
  } catch (error) {
    return null;
  }
}


export async function getValidAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const existingToken = cookieStore.get("accessToken")?.value;

  if (existingToken && !isTokenExpired(existingToken)) {
    return existingToken;
  }

  return await tryRefreshToken();
}
