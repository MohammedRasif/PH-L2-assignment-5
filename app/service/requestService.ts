import { cookies } from "next/headers";

const getBaseUrl = () => {
  const url = process.env.BACKEND_API_URL || "";
  return url.endsWith("/") ? url : `${url}/`;
};

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return {
    Authorization: token || "",
    "Content-Type": "application/json",
  };
}

async function safeJsonResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      statusCode: response.status,
      message: `Backend API returned status ${response.status} (${response.statusText}). Check server URL or endpoint.`,
    };
  }
}

// 1. Submit Rental Request (Tenant)
export async function createRentalRequest(propertyId: string) {
  const baseUrl = getBaseUrl();
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/requests`, {
    method: "POST",
    headers,
    body: JSON.stringify({ propertyId }),
  });

  return await safeJsonResponse(response);
}

// 2. Fetch Tenant Rental Requests
export async function getTenantRequests() {
  const baseUrl = getBaseUrl();
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/requests`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tenant rental requests");
  }

  const result = await safeJsonResponse(response);
  return result.data || [];
}

// 3. Fetch Landlord Rental Requests
export async function getLandlordRequests() {
  const baseUrl = getBaseUrl();
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/requests/landlord/all`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch landlord rental requests");
  }

  const result = await safeJsonResponse(response);
  return result.data || [];
}

// 4. Update Landlord Request Status (APPROVED or REJECTED)
export async function updateLandlordRequestStatus(requestId: string, status: "APPROVED" | "REJECTED") {
  const baseUrl = getBaseUrl();
  const headers = await getAuthHeaders();

  let response = await fetch(`${baseUrl}api/requests/landlord/${requestId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ status }),
  });

  if (response.status === 405) {
    response = await fetch(`${baseUrl}api/requests/landlord/${requestId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status }),
    });
  }

  return await safeJsonResponse(response);
}

// 5. Create Payment Intent (Tenant)
export async function createPayment(rentalRequestId: string, provider = "STRIPE") {
  const baseUrl = getBaseUrl();
  const headers = await getAuthHeaders();

  let response = await fetch(`${baseUrl}api/payments/create`, {
    method: "POST",
    headers,
    body: JSON.stringify({ rentalRequestId, provider }),
  });

  // Try fallback endpoint if 404
  if (response.status === 404) {
    response = await fetch(`${baseUrl}api/payments`, {
      method: "POST",
      headers,
      body: JSON.stringify({ rentalRequestId, provider }),
    });
  }

  return await safeJsonResponse(response);
}

// 6. Create Review POST {{base_url}}/api/reviews
export async function createReview(propertyId: string, rating: number, comment: string) {
  const baseUrl = getBaseUrl();
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/reviews`, {
    method: "POST",
    headers,
    body: JSON.stringify({ propertyId, rating, comment }),
  });

  return await safeJsonResponse(response);
}

