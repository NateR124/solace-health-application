/**
 * @jest-environment node
 */

describe('Live Data Integration Test', () => {
  it('should test the actual eating-disorders filtering issue', async () => {
    // Test the actual API endpoint
    const response = await fetch('http://localhost:3000/api/advocates?specialties=eating-disorders');
    const data = await response.json();
    
    console.log('Eating disorders filter result:', {
      totalCount: data.pagination.totalCount,
      foundAdvocates: data.data.length
    });

    // Test getting all data to see what's actually stored
    const allResponse = await fetch('http://localhost:3000/api/advocates?limit=50');
    const allData = await allResponse.json();
    
    // Check what format the data is actually in
    const sampleAdvocate = allData.data[0];
    console.log('Sample advocate specialties:', sampleAdvocate.specialties);
    
    // Count how many have eating disorders in the display format
    const withEatingDisorders = allData.data.filter((advocate: any) => 
      advocate.specialties.includes('Eating disorders')
    );
    
    console.log('Advocates with "Eating disorders" in display:', withEatingDisorders.length);
    
    // This will help us understand the data format mismatch
    expect(data.pagination.totalCount).toBe("0"); // Currently failing
    expect(withEatingDisorders.length).toBeGreaterThan(0); // Should have some
  });

  it('should test if the database actually contains slugs', async () => {
    // We need to check what's actually stored in the database vs what's returned
    const response = await fetch('http://localhost:3000/api/advocates?limit=1');
    const data = await response.json();
    
    // The API returns converted names, but we need to see if DB has slugs
    // This test documents the current behavior
    expect(data.data[0].specialties[0]).toMatch(/^[A-Z]/); // Names start with capital
    
    // The real issue is that filtering needs to work with the stored format
    // but returns the display format
  });
});