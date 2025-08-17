"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Advocate, FilterState, PaginationInfo, FilterOptions, AdvocatesResponse } from "@/types/advocate";
import { specialties, getSpecialtySlugs, getSpecialtiesByCategory } from "@/db/specialties";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true for initial state
  const [showContent, setShowContent] = useState(false);
  const [currentlyDisplayedFilters, setCurrentlyDisplayedFilters] = useState<FilterState>({
    searchTerm: "",
    selectedCity: "",
    selectedSpecialties: [],
  });

  // Format phone number to ###-###-#### format
  const formatPhoneNumber = (phoneNumber: number): string => {
    const phoneStr = phoneNumber.toString();
    if (phoneStr.length === 10) {
      return `${phoneStr.slice(0, 3)}-${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
    }
    return phoneStr; // Return as-is if not 10 digits
  };
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedCity: "",
    selectedSpecialties: [],
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 12,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    cities: [],
    specialties: [],
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [tempSelectedSpecialties, setTempSelectedSpecialties] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch advocates data with server-side pagination and filtering
  const fetchAdvocates = useCallback(async (page: number = 1, searchTerm: string = "", selectedCity: string = "", selectedSpecialties: string[] = []) => {
    // Start fade-out transition
    setShowContent(false);
    
    // Wait for fade-out to complete before starting API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setLoading(true);
    try {
      // Convert specialty names to slugs for API
      const specialtySlugs = getSpecialtySlugs(selectedSpecialties);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        search: searchTerm,
        city: selectedCity,
        specialties: specialtySlugs.join(","),
      });

      const response = await fetch(`/api/advocates?${params}`);
      const jsonResponse: AdvocatesResponse = await response.json();
      
      // Ensure minimum loading time for smooth experience
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setAdvocates(jsonResponse.data);
      setPagination(jsonResponse.pagination);
      setFilterOptions(jsonResponse.filterOptions);
      setCurrentlyDisplayedFilters({
        searchTerm,
        selectedCity,
        selectedSpecialties
      });
      setLoading(false);
      
      // Start fade-in transition after a brief delay
      setTimeout(() => {
        setShowContent(true);
      }, 100);
      
    } catch (error) {
      console.error("Error fetching advocates:", error);
      setLoading(false);
      setShowContent(true);
    }
  }, []);

  // Handle all filter changes
  useEffect(() => {
    // For search, use debouncing
    if (filters.searchTerm) {
      const timeoutId = setTimeout(() => {
        fetchAdvocates(1, filters.searchTerm, filters.selectedCity, filters.selectedSpecialties);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      // For non-search or empty search, call immediately
      fetchAdvocates(1, filters.searchTerm, filters.selectedCity, filters.selectedSpecialties);
    }
  }, [filters.searchTerm, filters.selectedCity, filters.selectedSpecialties]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  // Handle city filter
  const handleCityChange = (city: string) => {
    setFilters(prev => ({ ...prev, selectedCity: city }));
    setIsDropdownOpen(false);
  };

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle specialty modal
  const openSpecialtyModal = () => {
    setTempSelectedSpecialties([...filters.selectedSpecialties]);
    setIsSpecialtyModalOpen(true);
  };

  const closeSpecialtyModal = () => {
    setIsSpecialtyModalOpen(false);
    setTempSelectedSpecialties([]);
  };

  const toggleTempSpecialty = (specialty: string) => {
    setTempSelectedSpecialties(prev => 
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const applySpecialties = () => {
    setFilters(prev => ({
      ...prev,
      selectedSpecialties: [...tempSelectedSpecialties]
    }));
    closeSpecialtyModal();
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchAdvocates(page, filters.searchTerm, filters.selectedCity, filters.selectedSpecialties);
    
    // Scroll to top of page smoothly
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      selectedCity: "",
      selectedSpecialties: [],
    });
  };

  // Handle clicking on specialty tags in cards
  const toggleSpecialtyFromCard = (specialty: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSpecialties: prev.selectedSpecialties.includes(specialty)
        ? prev.selectedSpecialties.filter(s => s !== specialty)
        : [...prev.selectedSpecialties, specialty]
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Green Top Section */}
      <div className="w-full h-5 bg-[#1d4339]"></div>
      
      {/* Main Content Area with Curved Corners */}
      <main className="bg-[rgb(255,253,250)] rounded-t-3xl relative -mt-3 min-h-screen">
        <div className="container mx-auto px-6 pt-12 pb-8">

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Name Search */}
          <div>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={handleSearchChange}
              placeholder="Search"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[rgb(40,94,80)]/20 focus:border-[rgb(40,94,80)] font-body transition-all duration-300 hover:bg-white/90 shadow-sm hover:shadow-md"
            />
          </div>

          {/* Location Filter - Custom Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              title="Toggle specialty"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[rgb(40,94,80)]/20 focus:border-[rgb(40,94,80)] font-body transition-all duration-300 hover:bg-white/90 shadow-sm hover:shadow-md text-left flex items-center justify-between"
            >
              <span className={filters.selectedCity ? "text-gray-900" : "text-gray-500"}>
                {filters.selectedCity || "Location"}
              </span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            <div className={`absolute top-full left-0 right-0 mt-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden transition-all duration-300 ${
              isDropdownOpen 
                ? 'opacity-100 transform translate-y-0 scale-100' 
                : 'opacity-0 transform translate-y-2 scale-95 pointer-events-none'
            }`}>
              <div className="max-h-48 overflow-y-auto">
                <button
                  onClick={() => handleCityChange("")}
                  title="Select All Locations"
                  className="w-full px-4 py-3 text-left hover:bg-[rgb(40,94,80)]/10 transition-all duration-200 font-body border-b border-gray-100 last:border-b-0"
                >
                  All Locations
                </button>
                {filterOptions.cities.map(city => (
                  <button
                    key={city}
                    onClick={() => handleCityChange(city)}
                    className={`w-full px-4 py-3 text-left hover:bg-[rgb(40,94,80)]/10 transition-all duration-200 font-body border-b border-gray-100 last:border-b-0 ${
                      filters.selectedCity === city ? 'bg-[rgb(40,94,80)]/5 text-[rgb(40,94,80)]' : ''
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Specialization Button */}
          <div>
            <button
              onClick={openSpecialtyModal}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[rgb(40,94,80)]/20 focus:border-[rgb(40,94,80)] font-body transition-all duration-300 hover:bg-white/90 shadow-sm hover:shadow-md text-left flex items-center justify-between"
            >
              <span className="text-gray-900">
                Specialization
                {filters.selectedSpecialties.length > 0 && (
                  <span className="ml-2 text-sm text-[rgb(40,94,80)]">
                    ({filters.selectedSpecialties.length} selected)
                  </span>
                )}
              </span>
              <svg 
                className="w-4 h-4"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Selected Specialties Display */}
        {filters.selectedSpecialties.length > 0 && (
          <div className="mt-6 p-4 bg-[rgb(40,94,80)]/5 rounded-xl border border-[rgb(40,94,80)]/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-subheading text-gray-700">
                Selected Specializations ({filters.selectedSpecialties.length})
              </h3>
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-[rgb(40,94,80)] transition-colors font-body underline"
              >
                Clear Filters
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.selectedSpecialties.map(specialty => (
                <span
                  key={specialty}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[rgb(40,94,80)] text-white text-sm rounded-full font-light"
                >
                  {specialty}
                  <button
                    title="Set Filters"
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      selectedSpecialties: prev.selectedSpecialties.filter(s => s !== specialty)
                    }))}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>


      {/* Content Container with Smooth Fade Transitions */}
      <div id="results-section" className="relative mb-8">
        {/* Advocates Grid with Smooth Fade Transition */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ease-in-out ${
            showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-6'
          }`}
        >
          {advocates.map((advocate, index) => (
            <div 
              key={`${advocate.firstName}-${advocate.lastName}-${index}`} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {/* Placeholder for profile picture */}
              <div className="w-full h-48 bg-gradient-to-br from-[#1d4339] to-[#0f2a24] flex items-center justify-center">
                <div className="text-white text-6xl font-bold">
                  {advocate.firstName.charAt(0)}{advocate.lastName.charAt(0)}
                </div>
              </div>
              
              {/* Advocate Information */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {advocate.firstName} {advocate.lastName}, {advocate.degree}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="font-body"><span className="font-subheading">Location:</span> {advocate.city}</p>
                  <p className="font-body"><span className="font-subheading">Experience:</span> {advocate.yearsOfExperience} years</p>
                  <p className="font-body"><span className="font-subheading">Phone:</span> {formatPhoneNumber(advocate.phoneNumber)}</p>
                </div>
                
                {/* Specialties */}
                <div className="mt-3">
                  <p className="text-sm font-subheading text-gray-700 mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      // Separate selected and non-selected specialties
                      const selectedSpecialties = advocate.specialties.filter(specialty => 
                        currentlyDisplayedFilters.selectedSpecialties.includes(specialty)
                      );
                      const otherSpecialties = advocate.specialties.filter(specialty => 
                        !currentlyDisplayedFilters.selectedSpecialties.includes(specialty)
                      );
                      
                      // Combine with selected first, then others
                      const sortedSpecialties = [...selectedSpecialties, ...otherSpecialties];
                      const displaySpecialties = sortedSpecialties.slice(0, 3);
                      
                      return (
                        <>
                          {displaySpecialties.map((specialty, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => toggleSpecialtyFromCard(specialty)}
                              className={`inline-block text-xs px-2 py-1 rounded-full font-light transition-all duration-200 hover:scale-105 cursor-pointer ${
                                currentlyDisplayedFilters.selectedSpecialties.includes(specialty)
                                  ? "bg-[rgb(40,94,80)] text-white hover:bg-[rgb(52,120,102)]"
                                  : "bg-[#1d4339]/10 text-[#1d4339] hover:bg-[#1d4339]/20"
                              }`}
                              title={`${currentlyDisplayedFilters.selectedSpecialties.includes(specialty) ? 'Remove' : 'Add'} ${specialty} filter`}
                            >
                              {specialty}
                            </button>
                          ))}
                          {advocate.specialties.length > 3 && (
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-light">
                              +{advocate.specialties.length - 3} more
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {advocates.length === 0 && (
        <div 
          className={`text-center py-12 transition-all duration-700 ease-in-out ${
            showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-6'
          }`}
        >
          <p className="text-gray-500 text-lg font-body">No advocates found matching your criteria.</p>
          <button
            onClick={resetFilters}
            className="mt-4 bg-[#1d4339] text-white px-4 py-2 rounded-md hover:bg-[#0f2a24] transition-colors font-subheading"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPreviousPage}
            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 font-subheading"
          >
            Previous
          </button>
          
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 text-sm rounded-md font-subheading ${
                page === pagination.currentPage
                  ? "bg-[#1d4339] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 font-subheading"
          >
            Next
          </button>
          </div>
        )}
        </div>
      </main>
      
      {/* Specialty Selection Modal */}
      {isSpecialtyModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-heading text-gray-800">Select Specializations</h2>
              <button
                title="Close Speciality Modal"
                onClick={closeSpecialtyModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Selected Specialties Display */}
            {tempSelectedSpecialties.length > 0 && (
              <div className="p-6 border-b border-gray-200 bg-[rgb(40,94,80)]/5">
                <h3 className="text-sm font-subheading text-gray-700 mb-3">
                  Selected ({tempSelectedSpecialties.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tempSelectedSpecialties.map(specialty => (
                    <span
                      key={specialty}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[rgb(40,94,80)] text-white text-sm rounded-full font-light"
                    >
                      {specialty}
                      <button
                        title="Toggle Temp Specialty"
                        onClick={() => toggleTempSpecialty(specialty)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Specialties by Category */}
            <div className="flex-1 overflow-y-auto p-6">
              {Object.entries(getSpecialtiesByCategory()).map(([category, categorySpecialties]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-subheading text-gray-800 mb-3 border-b border-gray-200 pb-2">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categorySpecialties.map(specialty => (
                      <button
                        key={specialty.slug}
                        onClick={() => toggleTempSpecialty(specialty.label)}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 font-body ${
                          tempSelectedSpecialties.includes(specialty.label)
                            ? "border-[rgb(40,94,80)] bg-[rgb(40,94,80)]/10 text-[rgb(40,94,80)]"
                            : "border-gray-200 bg-white/50 hover:border-[rgb(40,94,80)]/30 hover:bg-[rgb(40,94,80)]/5"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium leading-relaxed">{specialty.label}</div>
                            {specialty.subLabel && (
                              <div className="text-xs text-gray-500 mt-1">{specialty.subLabel}</div>
                            )}
                          </div>
                          {tempSelectedSpecialties.includes(specialty.label) && (
                            <svg className="w-5 h-5 text-[rgb(40,94,80)] ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-body">
                  {tempSelectedSpecialties.length} specialization{tempSelectedSpecialties.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={closeSpecialtyModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-subheading"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applySpecialties}
                    disabled={tempSelectedSpecialties.length === 0}
                    className="px-6 py-2 bg-[rgb(40,94,80)] text-white rounded-lg hover:bg-[rgb(52,120,102)] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-subheading"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
