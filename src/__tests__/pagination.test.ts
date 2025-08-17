/**
 * @jest-environment node
 */

import { GET } from '../app/api/advocates/route';
import { NextRequest } from 'next/server';

// Mock the database
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
  ],
  getSpecialtyNames: jest.fn((slugs: string[]) => {
    const specialtyMap: { [key: string]: string } = {
      'bipolar': 'Bipolar',
      'lgbtq': 'LGBTQ',
    };
    return slugs.map(slug => specialtyMap[slug]).filter(Boolean);
  })
}));

import db from '../db';

describe('Pagination Tests', () => {
  // Create 25 mock advocates for testing pagination
  const createMockAdvocates = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      firstName: `First${i + 1}`,
      lastName: `Last${i + 1}`,
      city: 'Test City',
      degree: 'MD',
      specialties: ['bipolar'],
      yearsOfExperience: 5,
      phoneNumber: 5550000000 + i,
    }));
  };

  const allAdvocates = createMockAdvocates(25); // 25 total advocates
  const defaultLimit = 12; // Default page size

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page 1 (First Page)', () => {
    it('should return first 12 advocates with correct pagination info', async () => {
      const page1Advocates = allAdvocates.slice(0, 12); // First 12

      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(allAdvocates) // All for filter options
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(page1Advocates)
              })
            })
          })
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 25 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates?page=1&limit=12');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(12);
      
      // Check pagination info
      expect(data.pagination.currentPage).toBe(1);
      expect(data.pagination.totalPages).toBe(3); // 25 / 12 = 3 pages (rounded up)
      expect(data.pagination.totalCount).toBe(25);
      expect(data.pagination.limit).toBe(12);
      expect(data.pagination.hasPreviousPage).toBe(false); // First page
      expect(data.pagination.hasNextPage).toBe(true); // More pages exist

      // Verify we got the first 12 advocates
      expect(data.data[0].firstName).toBe('First1');
      expect(data.data[11].firstName).toBe('First12');
    });
  });

  describe('Page 2 (Middle Page)', () => {
    it('should return advocates 13-24 with correct pagination info', async () => {
      const page2Advocates = allAdvocates.slice(12, 24); // Advocates 13-24

      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(allAdvocates)
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(page2Advocates)
              })
            })
          })
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 25 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates?page=2&limit=12');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(12);
      
      // Check pagination info
      expect(data.pagination.currentPage).toBe(2);
      expect(data.pagination.totalPages).toBe(3);
      expect(data.pagination.totalCount).toBe(25);
      expect(data.pagination.limit).toBe(12);
      expect(data.pagination.hasPreviousPage).toBe(true); // Can go back
      expect(data.pagination.hasNextPage).toBe(true); // Can go forward

      // Verify we got advocates 13-24
      expect(data.data[0].firstName).toBe('First13');
      expect(data.data[11].firstName).toBe('First24');
    });
  });

  describe('Page 3 (Last Page)', () => {
    it('should return last advocate with correct pagination info', async () => {
      const page3Advocates = allAdvocates.slice(24, 25); // Only advocate 25

      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(allAdvocates)
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(page3Advocates)
              })
            })
          })
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 25 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates?page=3&limit=12');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1); // Only 1 advocate on last page
      
      // Check pagination info
      expect(data.pagination.currentPage).toBe(3);
      expect(data.pagination.totalPages).toBe(3);
      expect(data.pagination.totalCount).toBe(25);
      expect(data.pagination.limit).toBe(12);
      expect(data.pagination.hasPreviousPage).toBe(true); // Can go back
      expect(data.pagination.hasNextPage).toBe(false); // Last page

      // Verify we got the last advocate
      expect(data.data[0].firstName).toBe('First25');
    });
  });

  describe('Offset Calculation', () => {
    it('should calculate correct offset for each page', async () => {
      const testCases = [
        { page: 1, expectedOffset: 0 },   // (1-1) * 12 = 0
        { page: 2, expectedOffset: 12 },  // (2-1) * 12 = 12
        { page: 3, expectedOffset: 24 },  // (3-1) * 12 = 24
        { page: 5, expectedOffset: 48 },  // (5-1) * 12 = 48
      ];

      for (const testCase of testCases) {
        jest.clearAllMocks();
        
        (db.select as jest.Mock)
          .mockReturnValueOnce({
            from: jest.fn().mockResolvedValue([])
          })
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                  offset: jest.fn().mockResolvedValue([])
                })
              })
            })
          })
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockResolvedValue([{ count: 0 }])
            })
          });

        const request = new NextRequest(`http://localhost:3000/api/advocates?page=${testCase.page}&limit=12`);
        await GET(request);

        // Verify offset was called with correct value
        const mockChain = (db.select as jest.Mock).mock.results[1].value.from().where().limit();
        expect(mockChain.offset).toHaveBeenCalledWith(testCase.expectedOffset);
      }
    });
  });

  describe('Page Boundaries', () => {
    it('should handle page=0 by defaulting to page 1', async () => {
      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue([])
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue([])
              })
            })
          })
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 0 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates?page=0&limit=12');
      const response = await GET(request);
      const data = await response.json();

      expect(data.pagination.currentPage).toBe(1); // Should default to 1
    });

    it('should handle missing page parameter by defaulting to page 1', async () => {
      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue([])
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue([])
              })
            })
          })
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 0 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates?limit=12');
      const response = await GET(request);
      const data = await response.json();

      expect(data.pagination.currentPage).toBe(1); // Should default to 1
    });
  });

  describe('Different Page Sizes', () => {
    it('should handle custom page size (limit=6)', async () => {
      const customPageAdvocates = allAdvocates.slice(0, 6); // First 6

      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(allAdvocates)
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(customPageAdvocates)
              })
            })
          })
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 25 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates?page=1&limit=6');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(6);
      expect(data.pagination.limit).toBe(6);
      expect(data.pagination.totalPages).toBe(5); // 25 / 6 = 5 pages (rounded up)
    });
  });

  describe('Edge Cases', () => {
    it('should handle requesting page beyond total pages', async () => {
      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(allAdvocates)
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue([]) // No results
              })
            })
          })
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 25 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates?page=10&limit=12'); // Page 10 doesn't exist
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(0);
      expect(data.pagination.currentPage).toBe(10);
      expect(data.pagination.totalPages).toBe(3);
      expect(data.pagination.hasNextPage).toBe(false);
      expect(data.pagination.hasPreviousPage).toBe(true);
    });
  });
});