import { getValidAccessToken, tryRefreshToken } from "./refreshToken";

export async function getMe() {
  try {
    let token = await getValidAccessToken();

    if (!token) {
      return null;
    }

    const baseUrl = process.env.BACKEND_API_URL || "";
    const normalizedUrl = baseUrl.endsWith("/") ? `${baseUrl}api/users/me` : `${baseUrl}/api/users/me`;

    let response = await fetch(normalizedUrl, {
      headers: {
        Authorization: token,
      },
      next: { revalidate: 0 } // Disable caching to get fresh profile data
    });

    // Retry if unauthorized / expired
    if (response.status === 401 || response.status === 403) {
      token = await tryRefreshToken();
      if (!token) {
        return null;
      }
      response = await fetch(normalizedUrl, {
        headers: {
          Authorization: token,
        },
        next: { revalidate: 0 }
      });
    }

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    if (result.success) {
      return result.data?.profile || null;
    }
    return null;
  } catch (error) {
    return null;
  }
}
