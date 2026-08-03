"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getAdminUsers, getAdminProperties, getAdminRentals } from "@/app/service/adminService";

export async function getAdminUsersAction() {
  try {
    const data = await getAdminUsers();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to fetch users" };
  }
}

export async function getAdminPropertiesAction() {
  try {
    const data = await getAdminProperties();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to fetch properties" };
  }
}

export async function getAdminRentalsAction() {
  try {
    const data = await getAdminRentals();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to fetch rentals" };
  }
}

export async function updateUserStatusAction(userId: string, status: "ACTIVE" | "BLOCKED") {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const baseUrl = process.env.BACKEND_API_URL || "";
    const url = baseUrl.endsWith("/") 
      ? `${baseUrl}api/admin/users/${userId}` 
      : `${baseUrl}/api/admin/users/${userId}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: token || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();
    
    if (result.success) {
      // Clear Next.js router and data cache to fetch fresh data instantly on the client
      revalidatePath("/admin-dashboard/users");
      revalidatePath("/admin-dashboard");
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
}

export async function createCategoryAction(name: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const baseUrl = process.env.BACKEND_API_URL || "";
    const url = baseUrl.endsWith("/") 
      ? `${baseUrl}api/categories` 
      : `${baseUrl}/api/categories`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const result = await response.json();

    if (result.success) {
      revalidatePath("/admin-dashboard/categories");
      revalidatePath("/admin-dashboard");
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      message: error.message || "An unexpected error occurred while creating category",
    };
  }
}

export async function getAdminCategoriesAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const baseUrl = process.env.BACKEND_API_URL || "";
    const url = baseUrl.endsWith("/") 
      ? `${baseUrl}api/categories` 
      : `${baseUrl}/api/categories`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token || "",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch categories",
    };
  }
}
