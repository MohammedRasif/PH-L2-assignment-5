export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  bedrooms?: number;
  amenities?: string[];
  isAvailable?: boolean;
}

export async function getProperties(filters: PropertyFilters = {}) {
  const baseUrl = process.env.BACKEND_API_URL || "";
  const normalizedUrl = baseUrl.endsWith("/") 
    ? `${baseUrl}api/properties` 
    : `${baseUrl}/api/properties`;

  // Build query parameters
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

  console.log("Fetching from Backend API:", urlWithParams);

  const response = await fetch(urlWithParams, {
    cache: "no-store", 
  });

  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }

  const result = await response.json();
  return result.data || [];
}
