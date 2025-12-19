
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
        id: 'home',
        label: 'INÍCIO',
        link: '/',
        hasMegaMenu: false
    },
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
                title: 'Sul do Brasil',
                items: ['Grêmio', 'Internacional', 'Juventude', 'Coritiba', 'Athletico-PR']
            }
        ],
        highlightImage: {
            src: 'https://images.unsplash.com/photo-1628891435256-3f7125ebad68?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            alt: 'Vitória',
            title: 'Camisas Oficiais',
            price: 'Qualidade Premium'
        }
    },
    {
        id: 'internacionais',
        label: 'EUROPEUS',
        link: '/europeus',
        hasMegaMenu: true,
        columns: [
            {
                title: 'Premier League',
                items: ['Arsenal', 'Liverpool', 'Manchester City', 'Manchester United', 'Chelsea', 'Tottenham']
            },
            {
                title: 'La Liga',
                items: ['Real Madrid', 'Barcelona', 'Atlético de Madrid']
            },
            {
                title: 'Série A / Outros',
                items: ['Juventus', 'Milan', 'Inter de Milão', 'Roma', 'Bayern de Munique', 'Borussia Dortmund', 'PSG']
            }
        ],
        highlightImage: {
            src: 'https://images.unsplash.com/photo-1626025437642-0b05076ca301?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            alt: 'Milan',
            title: 'Clubes Internacionais',
            price: 'As Melhores'
        }
    },
    {
        id: 'selecoes',
        label: 'SELEÇÕES',
        link: '/selecoes',
        hasMegaMenu: true,
        columns: [
            {
                title: 'América',
                items: ['Brasil', 'Argentina', 'Uruguai', 'México', 'EUA']
            },
            {
                title: 'Europa',
                items: ['Alemanha', 'Espanha', 'França', 'Inglaterra', 'Itália', 'Portugal', 'Bélgica']
            },
            {
                title: 'Ásia / África',
                items: ['Japão', 'Coreia do Sul', 'Nigéria', 'Marrocos']
            }
        ],
        highlightImage: {
            src: 'https://images.unsplash.com/photo-1549492193-4700d813725b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            alt: 'Seleções',
            title: 'Brasil 2024',
            price: 'Lançamentos'
        }
    },
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
                                            to={`${menu.link}?search=${encodeURIComponent(item)}`}
                                            className="text-gray-500 hover:text-dlsports-green text-sm transition-colors block py-0.5"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        to={`${menu.link}?search=${encodeURIComponent(col.title)}`}
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
