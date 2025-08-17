export interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt?: Date;
}

export interface FilterState {
  searchTerm: string;
  selectedCity: string;
  selectedSpecialties: string[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}


export interface AdvocatesResponse {
  data: Advocate[];
  pagination: PaginationInfo;
}