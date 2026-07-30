import { cookies } from "next/headers";

export async function getMe() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return null;
    }

    const baseUrl = process.env.BACKEND_API_URL || "";
    console.log(baseUrl,"kkkk")
    const normalizedUrl = baseUrl.endsWith("/") ? `${baseUrl}api/users/me` : `${baseUrl}/api/users/me`;
    const response = await fetch(normalizedUrl, {
      headers: {
        Authorization: token,
      },
      next: { revalidate: 0 } // Disable caching to get fresh profile data
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    if (result.success) {
      return result.data?.profile || null;
    }
    return null;
  } catch (error) {
    console.error("Error in getMe service:", error);
    return null;
  }
}
