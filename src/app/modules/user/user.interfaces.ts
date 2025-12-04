export interface GetAllUsersParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  searchTerm?: string;
  filters?: Record<string, any>;
}
