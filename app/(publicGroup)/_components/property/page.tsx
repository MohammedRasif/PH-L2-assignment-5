import { getProperties } from "@/app/service/propertyService";
import PropertyClient from "../_components/PropertyClient";

// Force Next.js to skip static caching so the data refreshes instantly when the page is reloaded
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PropertyPageProps {
  searchParams: Promise<{
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    categoryId?: string;
    bedrooms?: string;
    amenities?: string;
  }>;
}

export default async function PropertyPage({ searchParams }: PropertyPageProps) {
  const resolvedParams = await searchParams;

  const filters = {
    location: resolvedParams.location || undefined,
    minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
    categoryId: resolvedParams.categoryId || undefined,
    bedrooms: resolvedParams.bedrooms ? Number(resolvedParams.bedrooms) : undefined,
    amenities: resolvedParams.amenities ? resolvedParams.amenities.split(",") : undefined,
  };

  // This fetches the data on the server side on every request, without caching.
  const properties = await getProperties(filters);

  return (
    <PropertyClient 
      initialProperties={properties} 
      activeFilters={resolvedParams}
    />
  );
}