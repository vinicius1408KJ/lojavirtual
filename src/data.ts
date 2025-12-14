import type { Product } from './types';

export const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Camisa Brasil Home 2024/25 Torcedor Nike Masculina',
        price: 349.90,
        image_url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e6e44502-d766-4c92-b6c8-1bb971f65683/camisa-nike-brasil-I-2024-25-torcedor-pro-masculina.png',
        club: 'Seleção Brasileira',
        is_national: true,
        slug: 'brasil-home-2024',
        sizes: ['P', 'M', 'G', 'GG'],
        description: 'A Amarelinha mais tradicional do mundo.',
        active: true
    },
    {
        id: '2',
        name: 'Camisa Real Madrid Home 24/25 Adidas Masculina',
        price: 399.90,
        image_url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/2d9f44f107384a6c8e31003d60155606_9366/Camisa_1_Real_Madrid_24-25_Branco_IT5182_01_laydown.jpg',
        club: 'Real Madrid',
        is_national: false,
        slug: 'real-madrid-home-2024',
        sizes: ['P', 'M', 'G', 'GG'],
        active: true
    },
    {
        id: '3',
        name: 'Camisa Flamengo I 24/25 Adidas Masculina',
        price: 349.90,
        image_url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/01fdd45f63934d479c5a092873aa12d3_9366/Camisa_1_CR_Flamengo_24-25_Preto_IP8235_01_laydown.jpg',
        club: 'Flamengo',
        is_national: true,
        slug: 'flamengo-home-2024',
        sizes: ['P', 'M', 'G', 'GG'],
        active: true
    },
    {
        id: '4',
        name: 'Camisa Manchester City Home 24/25 Puma Masculina',
        price: 399.90,
        image_url: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/775075/01/fnd/BRA/fmt/png/Camisa-Manchester-City-Home-24/25-Masculina',
        club: 'Manchester City',
        is_national: false,
        slug: 'man-city-home-2024',
        sizes: ['P', 'M', 'G', 'GG'],
        active: true
    },
    {
        id: '5',
        name: 'Camisa Palmeiras I 24/25 Puma Masculina',
        price: 329.90,
        image_url: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/776269/01/bv/fnd/BRA/fmt/png/Camisa-Palmeiras-Home-Torcedor-2024-Masculina',
        club: 'Palmeiras',
        is_national: true,
        slug: 'palmeiras-home-2024',
        sizes: ['P', 'M', 'G', 'GG'],
        active: true
    },
    {
        id: '6',
        name: 'Camisa Barcelona Home 24/25 Nike Masculina',
        price: 399.90,
        image_url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e9fd17a9-83c9-4b6d-a16f-f5v6x9x0y0z0/camisa-fc-barcelona-2024-25-home.png',
        club: 'Barcelona',
        is_national: false,
        slug: 'barcelona-home-2024',
        sizes: ['P', 'M', 'G', 'GG'],
        active: true
    }
];
