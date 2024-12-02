export interface ISeller {
    seller_id: number;
    user_id: number;
    username: string;
    full_name: string;
    social_media: string;
    seller_status: string;
    seller_status_id: number,
    description: string;
    email: string;
    image_url: string;
    phone_number?: string;
    address?: string;
}