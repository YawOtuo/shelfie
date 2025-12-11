import { marketplaceAxios } from "../axiosinstance";
import {
    RecommendationBucket,
    RecommendationBucketListing,
} from "../types/recommendation-bucket";

export async function getAllRecommendationBuckets(
  skip: number = 0,
  limit: number = 100
): Promise<RecommendationBucket[]> {
  const params = new URLSearchParams();
  params.append("skip", skip.toString());
  params.append("limit", limit.toString());
  
  const url = `api/recommendation-buckets?${params.toString()}`;
  const response = await marketplaceAxios.get<RecommendationBucket[]>(url);
  return response.data;
}

export async function getRecommendationBucket(
  bucketId: number
): Promise<RecommendationBucket> {
  const response = await marketplaceAxios.get<RecommendationBucket>(
    `api/recommendation-buckets/${bucketId}`
  );
  return response.data;
}

export async function getRecommendationBucketListings(
  bucketId: number,
  skip: number = 0,
  limit: number = 100
): Promise<RecommendationBucketListing[]> {
  const params = new URLSearchParams();
  params.append("skip", skip.toString());
  params.append("limit", limit.toString());
  
  const url = `api/recommendation-buckets/${bucketId}/listings?${params.toString()}`;
  const response = await marketplaceAxios.get<RecommendationBucketListing[]>(url);
  return response.data;
}

