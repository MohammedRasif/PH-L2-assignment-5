"use server";

import { revalidatePath } from "next/cache";
import { getCategories, createProperty, updateProperty, deleteProperty, getProperties } from "@/app/service/propertyService";

export async function getPropertiesAction() {
  try {
    const data = await getProperties();
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch properties.",
    };
  }
}

export async function getCategoriesAction() {
  try {
    const data = await getCategories();
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch categories.",
    };
  }
}

export async function createPropertyAction(data: any) {
  try {
    const result = await createProperty(data);
    if (result?.success) {
      revalidatePath("/property");
      revalidatePath("/landlord-dashboard");
      revalidatePath("/landlord-dashboard/my-properties");
    }
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create property.",
    };
  }
}

export async function updatePropertyAction(id: string, data: any) {
  try {
    const result = await updateProperty(id, data);
    if (result?.success) {
      revalidatePath("/property");
      revalidatePath("/landlord-dashboard");
      revalidatePath("/landlord-dashboard/my-properties");
    }
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update property.",
    };
  }
}

export async function deletePropertyAction(id: string) {
  try {
    const result = await deleteProperty(id);
    if (result?.success) {
      revalidatePath("/property");
      revalidatePath("/landlord-dashboard");
      revalidatePath("/landlord-dashboard/my-properties");
    }
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete property.",
    };
  }
}
