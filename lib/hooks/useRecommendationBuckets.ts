import { useQuery } from "@tanstack/react-query";
import {
  getAllRecommendationBuckets,
  getRecommendationBucket,
  getRecommendationBucketListings,
} from "../api/recommendationBuckets";
import {
  RecommendationBucket,
  RecommendationBucketListing,
} from "../types/recommendation-bucket";

export interface RecommendationBucketsFilters {
  skip?: number;
  limit?: number;
}

export function useRecommendationBuckets(filters?: RecommendationBucketsFilters) {
  const skip = filters?.skip || 0;
  const limit = filters?.limit || 100;
  
  const query = useQuery<RecommendationBucket[], Error>({
    queryKey: ["recommendation-buckets", skip, limit],
    queryFn: () => getAllRecommendationBuckets(skip, limit),
  });

  return {
    buckets: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useRecommendationBucket(bucketId: number) {
  const query = useQuery<RecommendationBucket, Error>({
    queryKey: ["recommendation-bucket", bucketId],
    queryFn: () => getRecommendationBucket(bucketId),
    enabled: !!bucketId,
  });

  return {
    bucket: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useRecommendationBucketListings(
  bucketId: number,
  skip: number = 0,
  limit: number = 100
) {
  const query = useQuery<RecommendationBucketListing[], Error>({
    queryKey: ["recommendation-bucket-listings", bucketId, skip, limit],
    queryFn: () => getRecommendationBucketListings(bucketId, skip, limit),
    enabled: !!bucketId,
  });

  return {
    listings: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

