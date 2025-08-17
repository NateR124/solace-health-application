import db from "../../../db";
import { advocates } from "../../../db/schema";
import { specialties, getSpecialtyLabels } from "../../../db/specialties";
import { getLocationDisplayNames, getLocationByCity } from "../../../db/locations";
import { NextRequest } from "next/server";
import { sql, ilike, and, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Get pagination parameters
  const rawPage = parseInt(searchParams.get("page") || "1");
  const page = Math.max(1, rawPage); // Ensure page is at least 1
  const limit = parseInt(searchParams.get("limit") || "12");
  const offset = (page - 1) * limit;
  
  // Get filter parameters
  const searchTerm = searchParams.get("search") || "";
  const selectedCityDisplay = searchParams.get("city") || "";
  const selectedSpecialties = searchParams.get("specialties")?.split(",").filter(Boolean) || []; // These are slugs
  
  // Convert "City, State" back to just city name for database filtering
  const selectedCity = selectedCityDisplay.includes(',') 
    ? selectedCityDisplay.split(',')[0].trim() 
    : selectedCityDisplay;
  
  try {
    // Get all data from database for filter options
    const allData = await db.select().from(advocates);
    
    // Build where conditions
    const conditions = [];
    
    // Search by name (names that start with the search term)
    if (searchTerm) {
      conditions.push(
        or(
          ilike(advocates.firstName, `${searchTerm}%`),
          ilike(advocates.lastName, `${searchTerm}%`)
        )
      );
    }
    
    // Filter by city
    if (selectedCity) {
      conditions.push(sql`${advocates.city} = ${selectedCity}`);
    }
    
    // Filter by specialties (check if any selected specialty exists in the JSONB array)
    if (selectedSpecialties.length > 0) {
      // Try the most basic approach with literal SQL
      const specialtyConditions = selectedSpecialties.map(specialty => {
        const jsonArray = JSON.stringify([specialty]);
        return sql.raw(`payload @> '${jsonArray}'`);
      });
      conditions.push(or(...specialtyConditions));
    }
    
    // Get filtered data with pagination
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const rawFilteredData = await db
      .select()
      .from(advocates)
      .where(whereClause)
      .limit(limit)
      .offset(offset);
    
    // Transform specialty slugs to full labels and cities to "City, State" format for frontend
    const filteredData = rawFilteredData.map((advocate: any) => ({
      ...advocate,
      specialties: getSpecialtyLabels(advocate.specialties as string[]),
      city: getLocationByCity(advocate.city) 
        ? `${getLocationByCity(advocate.city)!.city}, ${getLocationByCity(advocate.city)!.state}`
        : advocate.city
    }));
    
    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(advocates)
      .where(whereClause);
    
    const totalCount = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    
    // Get unique cities in "City, State" format for filter options
    const uniqueCityNames = Array.from(new Set(allData.map((advocate: any) => advocate.city)));
    const allCities = getLocationDisplayNames(uniqueCityNames as string[]).sort();
    
    // Return all available specialties with their full labels
    const allSpecialties = specialties.map(s => s.label).sort((a, b) => a.localeCompare(b));

    return Response.json({
      data: filteredData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      },
      filterOptions: {
        cities: allCities,
        specialties: allSpecialties
      }
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
