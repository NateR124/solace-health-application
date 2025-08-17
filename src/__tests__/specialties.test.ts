import { 
  specialties, 
  getSpecialtyBySlug, 
  getSpecialtyLabels, 
  getSpecialtySlugs 
} from '../db/specialties';

describe('Specialty Helper Functions', () => {
  describe('getSpecialtyBySlug', () => {
    it('should return correct specialty for valid slug', () => {
      const result = getSpecialtyBySlug('bipolar');
      expect(result).toEqual({
        slug: 'bipolar',
        label: 'Bipolar',
        subLabel: '',
        category: 'Mental Health & Trauma'
      });
    });

    it('should return undefined for invalid slug', () => {
      const result = getSpecialtyBySlug('nonexistent-slug');
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty slug', () => {
      const result = getSpecialtyBySlug('');
      expect(result).toBeUndefined();
    });
  });

  describe('getSpecialtyLabels', () => {
    it('should convert valid slugs to labels', () => {
      const slugs = ['bipolar', 'lgbtq', 'adhd'];
      const result = getSpecialtyLabels(slugs);
      expect(result).toEqual(['Bipolar', 'LGBTQ', 'ADHD']);
    });

    it('should filter out invalid slugs', () => {
      const slugs = ['bipolar', 'invalid-slug', 'lgbtq'];
      const result = getSpecialtyLabels(slugs);
      expect(result).toEqual(['Bipolar', 'LGBTQ']);
    });

    it('should return empty array for empty input', () => {
      const result = getSpecialtyLabels([]);
      expect(result).toEqual([]);
    });

    it('should handle array with all invalid slugs', () => {
      const slugs = ['invalid-1', 'invalid-2'];
      const result = getSpecialtyLabels(slugs);
      expect(result).toEqual([]);
    });
  });

  describe('getSpecialtySlugs', () => {
    it('should convert valid labels to slugs', () => {
      const labels = ['Bipolar', 'LGBTQ', 'ADHD'];
      const result = getSpecialtySlugs(labels);
      expect(result).toEqual(['bipolar', 'lgbtq', 'adhd']);
    });

    it('should filter out invalid labels', () => {
      const labels = ['Bipolar', 'Invalid Label', 'LGBTQ'];
      const result = getSpecialtySlugs(labels);
      expect(result).toEqual(['bipolar', 'lgbtq']);
    });

    it('should return empty array for empty input', () => {
      const result = getSpecialtySlugs([]);
      expect(result).toEqual([]);
    });

    it('should handle case sensitivity', () => {
      const labels = ['bipolar', 'BIPOLAR', 'Bipolar'];
      const result = getSpecialtySlugs(labels);
      // Only 'Bipolar' with proper case should match
      expect(result).toEqual(['bipolar']);
    });
  });

  describe('specialties array structure', () => {
    it('should have all required fields for each specialty', () => {
      specialties.forEach(specialty => {
        expect(specialty).toHaveProperty('slug');
        expect(specialty).toHaveProperty('label');
        expect(specialty).toHaveProperty('subLabel');
        expect(specialty).toHaveProperty('category');
        expect(typeof specialty.slug).toBe('string');
        expect(typeof specialty.label).toBe('string');
        expect(typeof specialty.subLabel).toBe('string');
        expect(typeof specialty.category).toBe('string');
        expect(specialty.slug.length).toBeGreaterThan(0);
        expect(specialty.label.length).toBeGreaterThan(0);
        expect(specialty.category.length).toBeGreaterThan(0);
      });
    });

    it('should have unique slugs', () => {
      const slugs = specialties.map(s => s.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('should have valid slug format (lowercase, kebab-case)', () => {
      specialties.forEach(specialty => {
        expect(specialty.slug).toMatch(/^[a-z0-9-]+$/);
        // Should not start or end with hyphen
        expect(specialty.slug).not.toMatch(/^-|-$/);
      });
    });

    it('should have expected minimum number of specialties', () => {
      expect(specialties.length).toBeGreaterThanOrEqual(20);
    });
  });
});