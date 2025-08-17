import { 
  locations, 
  getLocationBySlug, 
  getLocationByCity,
  getLocationDisplayNames,
  getLocationSlugs,
  getAllLocationDisplayNames,
  getAllLocationSlugs
} from '../db/locations';

describe('Location Helper Functions', () => {
  describe('getLocationBySlug', () => {
    it('should return correct location for valid slug', () => {
      const result = getLocationBySlug('charlotte');
      expect(result).toEqual({
        slug: 'charlotte',
        city: 'Charlotte',
        state: 'NC'
      });
    });

    it('should return undefined for invalid slug', () => {
      const result = getLocationBySlug('nonexistent-slug');
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty slug', () => {
      const result = getLocationBySlug('');
      expect(result).toBeUndefined();
    });
  });

  describe('getLocationByCity', () => {
    it('should return correct location for valid city', () => {
      const result = getLocationByCity('Charlotte');
      expect(result).toEqual({
        slug: 'charlotte',
        city: 'Charlotte',
        state: 'NC'
      });
    });

    it('should return undefined for invalid city', () => {
      const result = getLocationByCity('Nonexistent City');
      expect(result).toBeUndefined();
    });

    it('should handle cities with spaces and special characters', () => {
      const result = getLocationByCity('Salt Lake City');
      expect(result?.slug).toBe('salt-lake-city');
      expect(result?.state).toBe('UT');
    });
  });

  describe('getLocationDisplayNames', () => {
    it('should convert valid city names to "City, State" format', () => {
      const cities = ['Charlotte', 'Austin', 'New York'];
      const result = getLocationDisplayNames(cities);
      expect(result).toEqual(['Charlotte, NC', 'Austin, TX', 'New York, NY']);
    });

    it('should preserve invalid city names as-is', () => {
      const cities = ['Charlotte', 'Invalid City', 'Austin'];
      const result = getLocationDisplayNames(cities);
      expect(result).toEqual(['Charlotte, NC', 'Invalid City', 'Austin, TX']);
    });

    it('should return empty array for empty input', () => {
      const result = getLocationDisplayNames([]);
      expect(result).toEqual([]);
    });
  });

  describe('getLocationSlugs', () => {
    it('should convert valid "City, State" format to slugs', () => {
      const displayNames = ['Charlotte, NC', 'Austin, TX', 'New York, NY'];
      const result = getLocationSlugs(displayNames);
      expect(result).toEqual(['charlotte', 'austin', 'new-york']);
    });

    it('should handle plain city names without state', () => {
      const displayNames = ['Charlotte', 'Austin', 'New York'];
      const result = getLocationSlugs(displayNames);
      expect(result).toEqual(['charlotte', 'austin', 'new-york']);
    });

    it('should filter out invalid city names', () => {
      const displayNames = ['Charlotte, NC', 'Invalid City, XX', 'Austin, TX'];
      const result = getLocationSlugs(displayNames);
      expect(result).toEqual(['charlotte', 'austin']);
    });

    it('should return empty array for empty input', () => {
      const result = getLocationSlugs([]);
      expect(result).toEqual([]);
    });
  });

  describe('getAllLocationDisplayNames', () => {
    it('should return all locations in "City, State" format, sorted', () => {
      const result = getAllLocationDisplayNames();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toMatch(/^.+, [A-Z]{2}$/); // Should match "City, STATE" format
      
      // Check if sorted alphabetically
      const sorted = [...result].sort();
      expect(result).toEqual(sorted);
    });

    it('should include known cities', () => {
      const result = getAllLocationDisplayNames();
      expect(result).toContain('Charlotte, NC');
      expect(result).toContain('Austin, TX');
      expect(result).toContain('New York, NY');
    });
  });

  describe('getAllLocationSlugs', () => {
    it('should return all location slugs, sorted', () => {
      const result = getAllLocationSlugs();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toMatch(/^[a-z0-9-]+$/); // Should be lowercase kebab-case
      
      // Check if sorted alphabetically
      const sorted = [...result].sort();
      expect(result).toEqual(sorted);
    });

    it('should include known slugs', () => {
      const result = getAllLocationSlugs();
      expect(result).toContain('charlotte');
      expect(result).toContain('austin');
      expect(result).toContain('new-york');
    });
  });

  describe('locations array structure', () => {
    it('should have all required fields for each location', () => {
      locations.forEach(location => {
        expect(location).toHaveProperty('slug');
        expect(location).toHaveProperty('city');
        expect(location).toHaveProperty('state');
        expect(typeof location.slug).toBe('string');
        expect(typeof location.city).toBe('string');
        expect(typeof location.state).toBe('string');
        expect(location.slug.length).toBeGreaterThan(0);
        expect(location.city.length).toBeGreaterThan(0);
        expect(location.state.length).toBe(2); // State abbreviations should be 2 characters
      });
    });

    it('should have unique slugs', () => {
      const slugs = locations.map(l => l.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('should have unique cities', () => {
      const cities = locations.map(l => l.city);
      const uniqueCities = new Set(cities);
      expect(uniqueCities.size).toBe(cities.length);
    });

    it('should have valid slug format (lowercase, kebab-case)', () => {
      locations.forEach(location => {
        expect(location.slug).toMatch(/^[a-z0-9-]+$/);
        // Should not start or end with hyphen
        expect(location.slug).not.toMatch(/^-|-$/);
      });
    });

    it('should have valid state abbreviations (uppercase, 2 chars)', () => {
      locations.forEach(location => {
        expect(location.state).toMatch(/^[A-Z]{2}$/);
      });
    });

    it('should have expected minimum number of locations', () => {
      expect(locations.length).toBeGreaterThanOrEqual(30);
    });
  });
});