import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const setup = () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    // Return a mock with all necessary methods for development
    return {
      select: () => ({
        from: () => ({
          where: () => ({
            limit: () => ({
              offset: () => Promise.resolve([])
            })
          }),
          limit: () => ({
            offset: () => Promise.resolve([])
          })
        })
      }),
      insert: () => ({
        values: () => ({
          returning: () => Promise.resolve([]),
        }),
      }),
      delete: () => Promise.resolve(),
    } as any;
  }

  // for query purposes
  const queryClient = postgres(process.env.DATABASE_URL);
  const db = drizzle(queryClient, { schema });
  return db;
};

export default setup();
