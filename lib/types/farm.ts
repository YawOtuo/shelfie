import { FarmImage } from "./farm-image";

export interface FarmingPractices {
    animal_care: string[];
    quality_control: string[];
    feed_management: string[];
    health_management: string[];
}

export interface Facilities {
    livestock_housing: string[];
    processing_facilities: string[];
}

export interface SustainabilityPractices {
    energy: string[];
    water_management: string[];
    waste_management: string[];
}

// Base interface for common livestock properties
export interface LivestockBase {
    id: number;
    name: string;
    identifier: string;
    is_active: boolean;
}

// LivestockCategory interface matching SQLAlchemy model
export interface LivestockCategory extends LivestockBase {
    created_at: string;
    updated_at: string;
    // Relationships
    subcategories?: LivestockSubCategory[];
    production_types?: ProductionType[];
    popularity_tracking?: PopularItem;
    farms?: Farm[];
}

// LivestockSubCategory interface matching SQLAlchemy model
export interface LivestockSubCategory extends LivestockBase {
    category_id: number;
    // Relationships
    category?: LivestockCategory;
    farms?: Farm[];
    breeds?: LivestockBreed[];
    production_types?: ProductionType[];
    popularity_tracking?: PopularItem;
}

// Additional interfaces for related entities
export interface LivestockBreed {
    id: number;
    name: string;
    subcategory_id: number;
    subcategory?: LivestockSubCategory;
}

export interface ProductionType {
    id: number;
    name: string;
    category_id?: number;
    subcategory_id?: number;
    category?: LivestockCategory;
    subcategory?: LivestockSubCategory;
}

export interface PopularItem {
    id: number;
    category_id?: number;
    subcategory_id?: number;
    category?: LivestockCategory;
    subcategory?: LivestockSubCategory;
}

// Farm interface with proper relationships
export interface Farm {
    id: number;
    name: string;
    location: string;
    location_json?: Record<string, any>; // Complete location object from API
    longitude?: number;
    latitude?: number;
    country?: string;
    size?: number;
    featured?: boolean;
    top_rated?: boolean;
    total_rating?: number;
    owners_email?: string;
    owners_contact?: string;
    owners_name?: string;
    farm_telephone?: string;
    farm_email?: string;
    farm_bio?: string;
    farm_catchy_bio?: string;
    date_founded?: string;
    avatar_url?: string;
    primary_image_url?: string;
    farm_services?: string[];
    farming_practices?: FarmingPractices;
    facilities?: Facilities;
    sustainability_practices?: SustainabilityPractices;
    certifications?: string[];
    number_of_workers?: number;
    created_at?: string;
    updated_at?: string;
    images?: FarmImage[];
    // Relationships matching SQLAlchemy
    livestock_categories?: LivestockCategory[];
    livestock_subcategories?: LivestockSubCategory[];
    distance_meters?: number;
    email_verified?: boolean;
    phone_number_verified?: boolean;
    has_ghana_card?: boolean;
    has_registration_document?: boolean;
    ghana_card_count?: number;
    registration_document_count?: number;
    verified?: boolean
}

// Farm creation interface
export interface FarmCreate {
    name: string;
    location: string;
    location_json: Record<string, any>; // Complete location object from API - mandatory for creation
    latitude: number;
    longitude: number;
    country?: string; // Optional country field
    owners_email?: string;
    owners_contact?: string;
    owners_name?: string;
    livestock_categories: string[]; // List of livestock category identifiers
    livestock_subcategories: string[]; // List of livestock subcategory identifiers
}

// Farm update interface
export interface FarmUpdate {
    name?: string;
    location?: string;
    location_json?: Record<string, any>;
    longitude?: number;
    latitude?: number;
    country?: string;
    size?: number;
    featured?: boolean;
    top_rated?: boolean;
    total_rating?: number;
    owners_email?: string;
    owners_contact?: string;
    owners_name?: string;
    farm_telephone?: string;
    farm_email?: string;
    farm_bio?: string;
    farm_catchy_bio?: string;
    date_founded?: string;
    avatar_url?: string;
    primary_image_url?: string;
    farm_services?: string[];
    farming_practices?: FarmingPractices;
    facilities?: Facilities;
    sustainability_practices?: SustainabilityPractices;
    certifications?: string[];
    number_of_workers?: number;
    livestock_categories?: number[];
    livestock_subcategories?: number[];
    email_verified?: boolean;
    phone_number_verified?: boolean;    
}

// Farm livestock category update request
export interface FarmLivestockCategoryUpdateRequest {
    category_identifiers: string[];
}

// Farm livestock subcategory update request
export interface FarmLivestockSubcategoryUpdateRequest {
    subcategory_identifiers: string[];
}

// Farm livestock categories and subcategories response
export interface FarmLivestockCategoriesAndSubcategoriesResponse {
    message: string;
    farm_id: number;
    categories: string[];
    subcategories: string[];
}

