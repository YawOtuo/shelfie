export interface FarmImage {
    id: number;
    image_url: string;
    caption?: string;
}

export interface FarmImageCreate {
    images: File[];
    captions?: string[];  // Each caption corresponds to the image at the same index
    is_avatar?: boolean;
}

export interface FarmImageDelete {
    image_id: number;
} 