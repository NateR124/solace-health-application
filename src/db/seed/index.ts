import db from "..";
import { advocates } from "../schema";
import { advocateData } from "./advocates";

async function seed() {
  try {
    console.log("Starting database seed...");
    
    // Clear existing data
    await db.delete(advocates);
    console.log("Cleared existing advocates data");
    
    // Insert seed data
    await db.insert(advocates).values(advocateData);
    console.log(`Inserted ${advocateData.length} advocates`);
    
    console.log("Database seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();