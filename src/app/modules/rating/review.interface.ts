

export interface Ireviews {
     rating:number;
     comment:string;

}

export interface ReviewQueryParams {
  page?: number;           // Page number for pagination, default = 1
  limit?: number;          // Items per page, default = 10
  search?: string;         // Search keyword (comment, etc.)
  fromUserId?: number;     // Filter by reviewer
  toUserId?: number;       // Filter by reviewed user
  travelPlanId?: number;   // Filter by travel plan
  minRating?: number;      // Minimum rating filter
  maxRating?: number;      // Maximum rating filter
  sortBy?: string;         // Sort field, default = "createdAt"
  sortOrder?: "asc" | "desc"; // Sort order, default = "desc"
  startDate?: string | Date; // Filter reviews created after this date
  endDate?: string | Date;   // Filter reviews created before this date
}
