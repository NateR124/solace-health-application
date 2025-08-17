import { Advocate, FilterState, PaginationInfo, FilterOptions, AdvocatesResponse } from '../types/advocate';

describe('Type Definitions', () => {
  describe('Advocate Interface', () => {
    it('should accept valid advocate object', () => {
      const advocate: Advocate = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        city: 'New York',
        degree: 'MD',
        specialties: ['bipolar', 'lgbtq'],
        yearsOfExperience: 10,
        phoneNumber: 5551234567,
        createdAt: new Date()
      };
      
      expect(advocate.firstName).toBe('John');
      expect(advocate.specialties).toContain('bipolar');
      expect(advocate.yearsOfExperience).toBe(10);
    });

    it('should accept advocate without optional fields', () => {
      const advocate: Advocate = {
        firstName: 'Jane',
        lastName: 'Smith',
        city: 'Los Angeles',
        degree: 'PhD',
        specialties: ['adhd'],
        yearsOfExperience: 8,
        phoneNumber: 5559876543
      };
      
      expect(advocate.id).toBeUndefined();
      expect(advocate.createdAt).toBeUndefined();
    });
  });

  describe('FilterState Interface', () => {
    it('should accept valid filter state', () => {
      const filterState: FilterState = {
        searchTerm: 'John',
        selectedCity: 'New York',
        selectedSpecialties: ['bipolar', 'lgbtq']
      };
      
      expect(filterState.searchTerm).toBe('John');
      expect(filterState.selectedSpecialties).toHaveLength(2);
    });

    it('should accept empty filter state', () => {
      const filterState: FilterState = {
        searchTerm: '',
        selectedCity: '',
        selectedSpecialties: []
      };
      
      expect(filterState.selectedSpecialties).toHaveLength(0);
    });
  });

  describe('PaginationInfo Interface', () => {
    it('should accept valid pagination info', () => {
      const pagination: PaginationInfo = {
        currentPage: 2,
        totalPages: 5,
        totalCount: 50,
        limit: 12,
        hasNextPage: true,
        hasPreviousPage: true
      };
      
      expect(pagination.currentPage).toBe(2);
      expect(pagination.hasNextPage).toBe(true);
    });
  });

  describe('FilterOptions Interface', () => {
    it('should accept valid filter options', () => {
      const filterOptions: FilterOptions = {
        cities: ['New York', 'Los Angeles', 'Chicago'],
        specialties: ['Bipolar', 'LGBTQ', 'ADHD']
      };
      
      expect(filterOptions.cities).toContain('New York');
      expect(filterOptions.specialties).toContain('Bipolar');
    });
  });

  describe('AdvocatesResponse Interface', () => {
    it('should accept valid response structure', () => {
      const response: AdvocatesResponse = {
        data: [{
          firstName: 'John',
          lastName: 'Doe',
          city: 'New York',
          degree: 'MD',
          specialties: ['bipolar'],
          yearsOfExperience: 10,
          phoneNumber: 5551234567
        }],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 1,
          limit: 12,
          hasNextPage: false,
          hasPreviousPage: false
        },
        filterOptions: {
          cities: ['New York'],
          specialties: ['Bipolar']
        }
      };
      
      expect(response.data).toHaveLength(1);
      expect(response.pagination.currentPage).toBe(1);
      expect(response.filterOptions.cities).toContain('New York');
    });
  });
});