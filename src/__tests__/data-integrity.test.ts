/**
 * @jest-environment node
 */

import { specialties, getSpecialtyBySlug } from '../db/specialties';

describe('Data Integrity Tests', () => {
  describe('Specialty Slug vs Name Consistency', () => {
    // This test simulates the real issue we're seeing
    it('should detect when database contains names instead of slugs', () => {
      const mockDatabaseData = [
        {
          id: 1,
          specialties: ["Eating disorders", "Bipolar"] // Names instead of slugs - this is the bug!
        },
        {
          id: 2,
          specialties: ["eating-disorders", "bipolar"] // Slugs - this is correct
        }
      ];

      // Test filtering by slug when data contains names
      const searchSlug = "eating-disorders";
      
      // Simulate what the API is doing - checking if slug exists in specialties array
      const foundWithNames = mockDatabaseData[0].specialties.includes(searchSlug);
      const foundWithSlugs = mockDatabaseData[1].specialties.includes(searchSlug);
      
      expect(foundWithNames).toBe(false); // This will fail - the bug!
      expect(foundWithSlugs).toBe(true);  // This works correctly
    });

    it('should verify all specialty slugs are valid', () => {
      const testSlugs = ['eating-disorders', 'bipolar', 'lgbtq', 'adhd'];
      
      testSlugs.forEach(slug => {
        const specialty = getSpecialtyBySlug(slug);
        expect(specialty).toBeDefined();
        expect(specialty?.slug).toBe(slug);
      });
    });

    it('should demonstrate the correct slug-to-name conversion', () => {
      const testMapping = [
        { slug: 'eating-disorders', expectedName: 'Eating disorders' },
        { slug: 'bipolar', expectedName: 'Bipolar' },
        { slug: 'weight-nutrition', expectedName: 'Weight loss & nutrition' },
        { slug: 'adhd', expectedName: 'Attention and Hyperactivity (ADHD)' },
      ];

      testMapping.forEach(({ slug, expectedName }) => {
        const specialty = getSpecialtyBySlug(slug);
        expect(specialty?.name).toBe(expectedName);
      });
    });

    it('should test the database query logic we need', () => {
      // Simulate the JSONB query: specialties @> ["eating-disorders"]
      const advocateWithSlug = { specialties: ["eating-disorders", "bipolar"] };
      const advocateWithName = { specialties: ["Eating disorders", "Bipolar"] };
      
      const searchTerm = "eating-disorders";
      
      // This is how the database query should work
      const correctMatch = advocateWithSlug.specialties.includes(searchTerm);
      const incorrectMatch = advocateWithName.specialties.includes(searchTerm);
      
      expect(correctMatch).toBe(true);
      expect(incorrectMatch).toBe(false); // This reveals the data issue
    });
  });

  describe('Frontend-Backend Contract', () => {
    it('should ensure frontend sends slugs and backend expects slugs', () => {
      // Frontend should convert "Eating disorders" → "eating-disorders"
      const frontendSelectedName = "Eating disorders";
      const expectedSlug = "eating-disorders";
      
      // Simulate the conversion function from page.tsx
      const convertedSlug = specialties.find(s => s.name === frontendSelectedName)?.slug;
      
      expect(convertedSlug).toBe(expectedSlug);
    });

    it('should ensure backend converts slugs to names for frontend display', () => {
      // Backend should convert ["eating-disorders"] → ["Eating disorders"]
      const databaseSlugs = ["eating-disorders", "bipolar"];
      const expectedNames = ["Eating disorders", "Bipolar"];
      
      // Simulate the conversion from route.ts
      const convertedNames = databaseSlugs.map(slug => 
        specialties.find(s => s.slug === slug)?.name
      ).filter(Boolean);
      
      expect(convertedNames).toEqual(expectedNames);
    });
  });
});