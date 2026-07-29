import { cookies } from "next/headers";

export async function getMe() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return null;
    }

    const response = await fetch(`${process.env.BACKEND_API_URL || 'https://assignment-4-bay-six.vercel.app/'}api/users/me`, {
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
