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
    { slug: 'adhd', name: 'Attention and Hyperactivity (ADHD)', category: 'Mental Health' },
  ],
  getSpecialtyNames: jest.fn((slugs: string[]) => {
    const specialtyMap: { [key: string]: string } = {
      'bipolar': 'Bipolar',
      'lgbtq': 'LGBTQ',
      'adhd': 'Attention and Hyperactivity (ADHD)',
    };
    return slugs.map(slug => specialtyMap[slug]).filter(Boolean);
  })
}));

import db from '../db';

describe('/api/advocates', () => {
  const mockAdvocates = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      city: 'New York',
      degree: 'MD',
      specialties: ['bipolar', 'lgbtq'],
      yearsOfExperience: 10,
      phoneNumber: 5551234567,
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      city: 'Los Angeles',
      degree: 'PhD',
      specialties: ['adhd'],
      yearsOfExperience: 8,
      phoneNumber: 5559876543,
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the database responses
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            offset: jest.fn().mockResolvedValue([])
          })
        })
      })
    });
  });

  describe('GET request handling', () => {
    it('should handle basic request without filters', async () => {
      // Mock database calls
      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(mockAdvocates)
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(mockAdvocates.slice(0, 1))
              })
            })
          })
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 2 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('pagination');
      expect(data).toHaveProperty('filterOptions');
    });

    it('should handle pagination parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/advocates?page=2&limit=1');
      
      // Mock database calls with proper chain structure
      const mockDbChain = {
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              offset: jest.fn().mockResolvedValue([mockAdvocates[1]])
            })
          })
        })
      };

      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(mockAdvocates)
        })
        .mockReturnValueOnce(mockDbChain)
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 2 }])
          })
        });

      const response = await GET(request);
      const data = await response.json();

      expect(data.pagination.currentPage).toBe(2);
      expect(data.pagination.limit).toBe(1);
    });

    it('should handle search parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/advocates?search=John');
      
      const mockDbChain = {
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              offset: jest.fn().mockResolvedValue([mockAdvocates[0]])
            })
          })
        })
      };

      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(mockAdvocates)
        })
        .mockReturnValueOnce(mockDbChain)
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 1 }])
          })
        });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('data');
    });

    it('should handle specialty filtering', async () => {
      const request = new NextRequest('http://localhost:3000/api/advocates?specialties=bipolar,lgbtq');
      
      const mockDbChain = {
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              offset: jest.fn().mockResolvedValue([mockAdvocates[0]])
            })
          })
        })
      };

      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(mockAdvocates)
        })
        .mockReturnValueOnce(mockDbChain)
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 1 }])
          })
        });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('data');
    });

    it('should handle database errors gracefully', async () => {
      (db.select as jest.Mock).mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      const request = new NextRequest('http://localhost:3000/api/advocates');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch advocates');
    });
  });

  describe('Response structure validation', () => {
    it('should return correct response structure', async () => {
      const mockDbChain = {
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              offset: jest.fn().mockResolvedValue(mockAdvocates.slice(0, 1))
            })
          })
        })
      };

      (db.select as jest.Mock)
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(mockAdvocates)
        })
        .mockReturnValueOnce(mockDbChain)
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 2 }])
          })
        });

      const request = new NextRequest('http://localhost:3000/api/advocates');
      const response = await GET(request);
      const data = await response.json();

      // Check main structure
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('pagination');
      expect(data).toHaveProperty('filterOptions');

      // Check pagination structure
      expect(data.pagination).toHaveProperty('currentPage');
      expect(data.pagination).toHaveProperty('totalPages');
      expect(data.pagination).toHaveProperty('totalCount');
      expect(data.pagination).toHaveProperty('limit');
      expect(data.pagination).toHaveProperty('hasNextPage');
      expect(data.pagination).toHaveProperty('hasPreviousPage');

      // Check filter options structure
      expect(data.filterOptions).toHaveProperty('cities');
      expect(data.filterOptions).toHaveProperty('specialties');
      expect(Array.isArray(data.filterOptions.cities)).toBe(true);
      expect(Array.isArray(data.filterOptions.specialties)).toBe(true);
    });
  });
});