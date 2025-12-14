export interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    club: string;
    is_national: boolean;
    slug: string;
    description?: string;
    sizes?: string[];
    active?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
    size: string;
}
