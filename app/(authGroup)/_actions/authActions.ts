"use server"

import { cookies } from "next/headers";

const BASE_URL = process.env.BACKEND_API_URL || "https://assignment-4-bay-six.vercel.app/";

export async function loginAction(formData: any) {
  try {
    const response = await fetch(`${BASE_URL}api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success && data.data?.accessToken) {
      const cookieStore = await cookies();
      cookieStore.set("accessToken", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      if (data.data.refreshToken) {
        cookieStore.set("refreshToken", data.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });
      }
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      message: error.message || "An unexpected error occurred during login.",
    };
  }
}

export async function registerAction(formData: any) {
  try {
    const response = await fetch(`${BASE_URL}api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success && data.data?.accessToken) {
      const cookieStore = await cookies();
      cookieStore.set("accessToken", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      if (data.data.refreshToken) {
        cookieStore.set("refreshToken", data.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
      }
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      message: error.message || "An unexpected error occurred during registration.",
    };
  }
}
