"use server";

import { revalidatePath } from "next/cache";
import {
  createRentalRequest,
  getTenantRequests,
  getLandlordRequests,
  updateLandlordRequestStatus,
  createPayment,
} from "@/app/service/requestService";

export async function createRentalRequestAction(propertyId: string) {
  try {
    const result = await createRentalRequest(propertyId);
    if (result?.success) {
      revalidatePath("/property");
      revalidatePath("/rental-dashboard");
    }
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to submit rental request.",
    };
  }
}

export async function getTenantRequestsAction() {
  try {
    const data = await getTenantRequests();
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch rental requests.",
    };
  }
}

export async function getLandlordRequestsAction() {
  try {
    const data = await getLandlordRequests();
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch landlord requests.",
    };
  }
}

export async function updateLandlordRequestStatusAction(requestId: string, status: "APPROVED" | "REJECTED") {
  try {
    const result = await updateLandlordRequestStatus(requestId, status);
    if (result?.success) {
      revalidatePath("/landlord-dashboard");
      revalidatePath("/landlord-dashboard/requests");
    }
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update request status.",
    };
  }
}

export async function createPaymentAction(rentalRequestId: string, provider = "STRIPE") {
  try {
    const result = await createPayment(rentalRequestId, provider);
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create payment checkout session.",
    };
  }
}
