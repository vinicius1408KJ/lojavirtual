
import { Link } from 'react-router-dom';

interface SubCategory {
    title: string;
    items: string[];
}

interface MenuData {
    id: string;
    label: string;
    link: string;
    hasMegaMenu: boolean;
    columns?: SubCategory[];
    highlightImage?: {
        src: string;
        alt: string;
        title: string;
        price: string;
    };
}

export const MENU_DATA: MenuData[] = [
    {
        id: 'brasileiros',
        label: 'BRASILEIROS',
        link: '/nacionais',
        hasMegaMenu: true,
        columns: [
            {
                title: 'São Paulo',
                items: ['Corinthians', 'Palmeiras', 'São Paulo', 'Santos', 'Ponte Preta']
            },
            {
                title: 'Rio de Janeiro',
                items: ['Flamengo', 'Vasco', 'Fluminense', 'Botafogo']
            },
            {
                title: 'Minas Gerais',
                items: ['Atlético-MG', 'Cruzeiro', 'América-MG']
            },
            {
                title: 'Rio Grande do Sul',
                items: ['Grêmio', 'Internacional', 'Juventude']
            }
        ],
        highlightImage: {
            src: 'https://images.unsplash.com/photo-1628891435256-3f7125ebad68?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            alt: 'Vitória',
            title: 'Camisas Oficiais',
            price: 'a partir de R$ 79,90'
        }
    },
    {
        id: 'internacionais',
        label: 'INTERNACIONAIS',
        link: '/europeus',
        hasMegaMenu: true,
        columns: [
            {
                title: 'Liga Inglesa',
                items: ['Arsenal', 'Liverpool', 'Manchester City', 'Manchester United', 'Chelsea']
            },
            {
                title: 'Liga Espanhola',
                items: ['Real Madrid', 'Barcelona', 'Atlético de Madrid']
            },
            {
                title: 'Liga Italiana',
                items: ['Juventus', 'Milan', 'Inter de Milão', 'Roma']
            },
            {
                title: 'Liga Alemã',
                items: ['Bayern de Munique', 'Borussia Dortmund']
            }
        ],
        highlightImage: {
            src: 'https://images.unsplash.com/photo-1626025437642-0b05076ca301?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            alt: 'Milan',
            title: 'Clubes Puma',
            price: 'Confira'
        }
    },
    {
        id: 'selecoes',
        label: 'SELEÇÕES',
        link: '/selecoes', // Rota placeholder
        hasMegaMenu: true,
        columns: [
            {
                title: 'América do Sul',
                items: ['Brasil', 'Argentina', 'Uruguai', 'Colômbia']
            },
            {
                title: 'Europa',
                items: ['Alemanha', 'Espanha', 'França', 'Inglaterra', 'Itália', 'Portugal']
            },
            {
                title: 'Outros',
                items: ['Japão', 'EUA', 'México']
            }
        ],
        highlightImage: {
            src: 'https://images.unsplash.com/photo-1549492193-4700d813725b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            alt: 'Seleções Adidas',
            title: 'Seleções Adidas',
            price: 'Confira'
        }
    },
    { id: 'futebol', label: 'FUTEBOL', link: '/futebol', hasMegaMenu: false },
    { id: 'treino', label: 'TREINO', link: '/treino', hasMegaMenu: false },
    { id: 'esportes', label: 'ESPORTES', link: '/esportes', hasMegaMenu: false },
    { id: 'calcados', label: 'CALÇADOS', link: '/calcados', hasMegaMenu: false },
];

export function MegaMenu({ activeMenu }: { activeMenu: string | null }) {
    const menu = MENU_DATA.find(m => m.id === activeMenu);

    if (!menu || !menu.hasMegaMenu) return null;

    return (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 py-8 z-50 animate-fade-in">
            <div className="container mx-auto px-4 flex">
                {/* Lists */}
                <div className="flex-1 grid grid-cols-4 gap-8">
                    {menu.columns?.map((col, idx) => (
                        <div key={idx}>
                            <h3 className="font-bold text-gray-900 mb-4">{col.title}</h3>
                            <ul className="space-y-2">
                                {col.items.map(item => (
                                    <li key={item}>
                                        <Link
                                            to={`/nacionais?search=${encodeURIComponent(item)}`}
                                            className="text-gray-500 hover:text-dlsports-green text-sm transition-colors block py-0.5"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        to={`/nacionais?search=${encodeURIComponent(col.title)}`}
                                        className="text-dlsports-green font-bold text-sm hover:underline mt-2 inline-block"
                                    >
                                        + Ver todos
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Highlight Image */}
                {menu.highlightImage && (
                    <div className="w-80 ml-8 relative group cursor-pointer overflow-hidden rounded-lg">
                        <img
                            src={menu.highlightImage.src}
                            alt={menu.highlightImage.alt}
                            className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 text-white text-center">
                            <h3 className="text-2xl font-black italic mb-1">{menu.highlightImage.title}</h3>
                            <p className="text-sm font-bold mb-4">{menu.highlightImage.price}</p>
                            <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-dlsports-neon transition-colors">
                                Confira
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
