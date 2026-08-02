import { cookies } from "next/headers";

export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  bedrooms?: number;
  amenities?: string[];
  isAvailable?: boolean;
}

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

// 1. Fetch properties (Public / Filtered)
export async function getProperties(filters: PropertyFilters = {}) {
  const baseUrl = getBaseUrl();
  const normalizedUrl = `${baseUrl}api/properties`;

  const queryParams = new URLSearchParams();
  if (filters.location) queryParams.append("location", filters.location);
  if (filters.minPrice !== undefined) queryParams.append("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) queryParams.append("maxPrice", String(filters.maxPrice));
  if (filters.categoryId) queryParams.append("categoryId", filters.categoryId);
  if (filters.bedrooms !== undefined) queryParams.append("bedrooms", String(filters.bedrooms));
  if (filters.amenities && filters.amenities.length > 0) {
    queryParams.append("amenities", filters.amenities.join(","));
  }
  if (filters.isAvailable !== undefined) {
    queryParams.append("isAvailable", String(filters.isAvailable));
  }

  const queryString = queryParams.toString();
  const urlWithParams = queryString ? `${normalizedUrl}?${queryString}` : normalizedUrl;

  const response = await fetch(urlWithParams, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }

  const result = await response.json();
  return result.data || [];
}

// 2. Fetch categories from GET {{base_url}}/api/categories
export async function getCategories() {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}api/categories`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result = await response.json();
  return result.data || [];
}

// 3. Create a new property POST {{base_url}}/api/properties
export async function createProperty(propertyData: any) {
  const baseUrl = getBaseUrl();
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/properties`, {
    method: "POST",
    headers,
    body: JSON.stringify(propertyData),
  });

  return await response.json();
}

// 4. Update property PUT {{base_url}}/api/properties/:id
export async function updateProperty(id: string, propertyData: any) {
  const baseUrl = getBaseUrl();
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/properties/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(propertyData),
  });

  return await response.json();
}

// 5. Delete property DELETE {{base_url}}/api/properties/:id
export async function deleteProperty(id: string) {
  const baseUrl = getBaseUrl();
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/properties/${id}`, {
    method: "DELETE",
    headers,
  });

  return await response.json();
}

// 6. Fetch single property by ID GET {{base_url}}/api/properties/:id
export async function getPropertyById(id: string) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}api/properties/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch property details");
  }

  const result = await response.json();
  return result.data || null;
}

