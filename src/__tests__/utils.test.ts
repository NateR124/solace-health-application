describe('Utility Functions', () => {
  describe('Phone Number Formatting', () => {
    // Test the phone formatting logic that's in the main component
    const formatPhoneNumber = (phoneNumber: number): string => {
      const phoneStr = phoneNumber.toString();
      if (phoneStr.length === 10) {
        return `${phoneStr.slice(0, 3)}-${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
      }
      return phoneStr;
    };

    it('should format 10-digit numbers correctly', () => {
      expect(formatPhoneNumber(5551234567)).toBe('555-123-4567');
      expect(formatPhoneNumber(1234567890)).toBe('123-456-7890');
    });

    it('should return unformatted string for non-10-digit numbers', () => {
      expect(formatPhoneNumber(123456789)).toBe('123456789');
      expect(formatPhoneNumber(12345678901)).toBe('12345678901');
    });

    it('should handle edge cases', () => {
      expect(formatPhoneNumber(0)).toBe('0');
      expect(formatPhoneNumber(1000000000)).toBe('100-000-0000');
    });
  });

  describe('URL Parameter Handling', () => {
    // Test URL parameter parsing logic
    const parseSpecialties = (specialtiesParam: string | null): string[] => {
      return specialtiesParam?.split(",").filter(Boolean) || [];
    };

    it('should parse comma-separated specialties', () => {
      expect(parseSpecialties('bipolar,lgbtq,adhd')).toEqual(['bipolar', 'lgbtq', 'adhd']);
    });

    it('should handle empty specialties parameter', () => {
      expect(parseSpecialties('')).toEqual([]);
      expect(parseSpecialties(null)).toEqual([]);
    });

    it('should filter out empty values', () => {
      expect(parseSpecialties('bipolar,,lgbtq,')).toEqual(['bipolar', 'lgbtq']);
    });

    it('should handle single specialty', () => {
      expect(parseSpecialties('bipolar')).toEqual(['bipolar']);
    });
  });

  describe('Pagination Calculations', () => {
    const calculatePagination = (totalCount: number, currentPage: number, limit: number) => {
      const totalPages = Math.ceil(totalCount / limit);
      return {
        currentPage,
        totalPages,
        totalCount,
        limit,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1
      };
    };

    it('should calculate pagination correctly for first page', () => {
      const result = calculatePagination(50, 1, 12);
      expect(result).toEqual({
        currentPage: 1,
        totalPages: 5,
        totalCount: 50,
        limit: 12,
        hasNextPage: true,
        hasPreviousPage: false
      });
    });

    it('should calculate pagination correctly for middle page', () => {
      const result = calculatePagination(50, 3, 12);
      expect(result).toEqual({
        currentPage: 3,
        totalPages: 5,
        totalCount: 50,
        limit: 12,
        hasNextPage: true,
        hasPreviousPage: true
      });
    });

    it('should calculate pagination correctly for last page', () => {
      const result = calculatePagination(50, 5, 12);
      expect(result).toEqual({
        currentPage: 5,
        totalPages: 5,
        totalCount: 50,
        limit: 12,
        hasNextPage: false,
        hasPreviousPage: true
      });
    });

    it('should handle edge case with no items', () => {
      const result = calculatePagination(0, 1, 12);
      expect(result).toEqual({
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        limit: 12,
        hasNextPage: false,
        hasPreviousPage: false
      });
    });
  });
});