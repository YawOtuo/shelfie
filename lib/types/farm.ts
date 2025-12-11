export interface Farm {
  id: number;
  name: string;
  location: string;
  avatar_url?: string;
  total_rating: number;
  description?: string;
  verified?: boolean;
  listings_count?: number;
}

