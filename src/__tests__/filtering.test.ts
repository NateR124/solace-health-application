/**
 * @jest-environment node
 */

import { GET } from '../app/api/advocates/route';
import { NextRequest } from 'next/server';

// Mock the database with test data
jest.mock('../db', () => ({
  __esModule: true,
  default: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
  }
}));

// Mock specialties
jest.mock('../db/specialties', () => ({
  specialties: [
    { slug: 'bipolar', name: 'Bipolar', category: 'Mental Health' },
    { slug: 'lgbtq', name: 'LGBTQ', category: 'Identity & Lifestyle' },
    { slug: 'adhd', name: 'Attention and Hyperactivity (ADHD)', category: 'Mental Health' },
    { slug: 'trauma-ptsd', name: 'Trauma & PTSD', category: 'Mental Health' },
  ],
  getSpecialtyNames: jest.fn((slugs: string[]) => {
    const specialtyMap: { [key: string]: string } = {
      'bipolar': 'Bipolar',
      'lgbtq': 'LGBTQ', 
      'adhd': 'Attention and Hyperactivity (ADHD)',
      'trauma-ptsd': 'Trauma & PTSD',
    };
    return slugs.map(slug => specialtyMap[slug]).filter(Boolean);
  })
}));

import db from '../db';

describe('Specialty Filtering Integration Tests', () => {
  const mockAdvocatesData = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      city: 'New York',
      degree: 'MD',
      specialties: ['bipolar'], // Single specialty
      yearsOfExperience: 10,
      phoneNumber: 5551234567,
    },
    {
      id: 2,
      firstName: 'Jane', 
      lastName: 'Smith',
      city: 'Los Angeles',
      degree: 'PhD',
      specialties: ['bipolar', 'lgbtq', 'trauma-ptsd'], // Multiple specialties including bipolar
      yearsOfExperience: 8,
      phoneNumber: 5559876543,
    },
    {
      id: 3,
      firstName: 'Bob',
      lastName: 'Wilson',
      city: 'Chicago', 
      degree: 'MSW',
      specialties: ['adhd'], // Different single specialty
      yearsOfExperience: 5,
      phoneNumber: 5554567890,
    },
    {
      id: 4,
      firstName: 'Alice',
      lastName: 'Brown',
      city: 'Houston',
      degree: 'MD',
      specialties: ['lgbtq', 'trauma-ptsd'], // Multiple specialties, no bipolar
      yearsOfExperience: 12,
      phoneNumber: 5556543210,
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('No categories selected', () => {
    it('should return all advocates when no specialties filter is applied', async () => {
      // Mock database to return all advocates
      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(mockAdvocatesData)
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(mockAdvocatesData) // All 4 advocates
              })
            })
          })
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 4 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates?specialties=');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(4);
      expect(data.pagination.totalCount).toBe(4);
      
      // Verify all advocates are included
      const names = data.data.map((advocate: any) => `${advocate.firstName} ${advocate.lastName}`);
      expect(names).toContain('John Doe');
      expect(names).toContain('Jane Smith'); 
      expect(names).toContain('Bob Wilson');
      expect(names).toContain('Alice Brown');
    });
  });

  describe('Single category selected', () => {
    it('should return advocates with bipolar specialty (both single and multiple specialty advocates)', async () => {
      // Simulate filtering for 'bipolar' - should return John (single) and Jane (multiple)
      const bipolarAdvocates = mockAdvocatesData.filter(advocate => 
        advocate.specialties.includes('bipolar')
      );

      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(mockAdvocatesData)
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(bipolarAdvocates) // John and Jane
              })
            })
          })
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 2 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates?specialties=bipolar');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
      expect(data.pagination.totalCount).toBe(2);

      // Should include both single-specialty and multi-specialty advocates
      const names = data.data.map((advocate: any) => `${advocate.firstName} ${advocate.lastName}`);
      expect(names).toContain('John Doe'); // Single specialty: ['bipolar']
      expect(names).toContain('Jane Smith'); // Multiple specialties: ['bipolar', 'lgbtq', 'trauma-ptsd']
      
      // Should NOT include advocates without bipolar
      expect(names).not.toContain('Bob Wilson'); // ['adhd']
      expect(names).not.toContain('Alice Brown'); // ['lgbtq', 'trauma-ptsd']
    });

    it('should return advocates with lgbtq specialty', async () => {
      // Simulate filtering for 'lgbtq' - should return Jane and Alice
      const lgbtqAdvocates = mockAdvocatesData.filter(advocate => 
        advocate.specialties.includes('lgbtq')
      );

      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(mockAdvocatesData)
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(lgbtqAdvocates) // Jane and Alice
              })
            })
          })
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 2 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates?specialties=lgbtq');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);

      const names = data.data.map((advocate: any) => `${advocate.firstName} ${advocate.lastName}`);
      expect(names).toContain('Jane Smith'); // ['bipolar', 'lgbtq', 'trauma-ptsd']
      expect(names).toContain('Alice Brown'); // ['lgbtq', 'trauma-ptsd']
      
      // Should NOT include advocates without lgbtq
      expect(names).not.toContain('John Doe'); // ['bipolar']
      expect(names).not.toContain('Bob Wilson'); // ['adhd']
    });

    it('should return advocates with single specialty when filtering for that specialty', async () => {
      // Simulate filtering for 'adhd' - should return only Bob
      const adhdAdvocates = mockAdvocatesData.filter(advocate => 
        advocate.specialties.includes('adhd')
      );

      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(mockAdvocatesData)
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(adhdAdvocates) // Only Bob
              })
            })
          })
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 1 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates?specialties=adhd');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.pagination.totalCount).toBe(1);

      const names = data.data.map((advocate: any) => `${advocate.firstName} ${advocate.lastName}`);
      expect(names).toContain('Bob Wilson'); // Single specialty: ['adhd']
    });
  });

  describe('Multiple categories selected', () => {
    it('should return advocates that have ANY of the selected specialties (OR logic)', async () => {
      // Simulate filtering for 'bipolar,adhd' - should return John, Jane, and Bob
      const multipleSpecialtyAdvocates = mockAdvocatesData.filter(advocate => 
        advocate.specialties.some(specialty => ['bipolar', 'adhd'].includes(specialty))
      );

      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(mockAdvocatesData)
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(multipleSpecialtyAdvocates) // John, Jane, Bob
              })
            })
          })
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 3 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates?specialties=bipolar,adhd');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(3);
      expect(data.pagination.totalCount).toBe(3);

      const names = data.data.map((advocate: any) => `${advocate.firstName} ${advocate.lastName}`);
      expect(names).toContain('John Doe'); // Has bipolar
      expect(names).toContain('Jane Smith'); // Has bipolar
      expect(names).toContain('Bob Wilson'); // Has adhd
      
      // Should NOT include Alice (only has lgbtq and trauma-ptsd)
      expect(names).not.toContain('Alice Brown');
    });
  });

  describe('No results', () => {
    it('should return empty results when filtering for specialty that no one has', async () => {
      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(mockAdvocatesData)
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue([]) // No advocates
              })
            })
          })
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 0 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates?specialties=nonexistent-specialty');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(0);
      expect(data.pagination.totalCount).toBe(0);
    });
  });
});