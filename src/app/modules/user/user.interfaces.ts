export interface GetAllUsersParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  searchTerm?: string;
  filters?: Record<string, any>;
}
export interface IUserProfile {
  userId: number;
  bio?: string | null;
  fullName?: string | null;
  travelInterests: string[];
  visitedCountries: string[];
  currentLocation?: string | null;
  verified: boolean;
  rating: number;
  reviewCount: number;
  dateOfBirth?: Date | null;
  gender?: string | null;
  avatarUrl?: string | null;
}
