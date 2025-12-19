export interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    club: string;
    team?: string; // Adding team as alias or specific team name if club is generic
    is_national: boolean;
    region?: string; // e.g. 'São Paulo', 'Rio de Janeiro', 'Inglaterra'
    category?: string; // e.g. 'Futebol', 'Treino'
    slug: string;
    description?: string;
    sizes?: string[];
    active?: boolean;
    is_offer?: boolean;
    is_selection?: boolean;
    is_new?: boolean;
    old_price?: number;
    back_image_url?: string;
}

export interface CartItem extends Product {
    quantity: number;
    size: string;
}
