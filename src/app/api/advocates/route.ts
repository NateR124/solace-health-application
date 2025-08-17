import db from "@/db";
import { advocates } from "@/db/schema";
import { NextRequest } from "next/server";
import { sql, ilike, and, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Get pagination parameters
  const rawPage = parseInt(searchParams.get("page") || "1");
  const page = Math.max(1, rawPage);
  const limit = parseInt(searchParams.get("limit") || "12");
  const offset = (page - 1) * limit;
  
  // Get filter parameters
  const searchTerm = searchParams.get("search") || "";
  const selectedCity = searchParams.get("city") || "";
  const selectedSpecialties = searchParams.get("specialties")?.split(",").filter(Boolean) || [];
  
  try {
    const conditions = [];
    
    // Filter by first or last name
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
    
    // Filter by specialties
    if (selectedSpecialties.length > 0) {
      const mustHaveAll = selectedSpecialties
        .map(s => s.trim())
        .filter(Boolean)
        .map(s =>
          sql`
            EXISTS (
              SELECT 1
              FROM jsonb_array_elements_text(((${advocates.specialties} #>> '{}')::jsonb)) AS e(val)
              WHERE val = ${s}
            )
          `
        );

      conditions.push(and(...mustHaveAll));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const rawFilteredData = await db
      .select()
      .from(advocates)
      .where(whereClause)
      .limit(limit)
      .offset(offset);
    
    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(advocates)
      .where(whereClause);
    
    const totalCount = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    

    return Response.json({
      data: rawFilteredData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
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
