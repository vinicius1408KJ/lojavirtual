
import { Link } from 'react-router-dom';

interface MenuItemObj {
    label: string;
    search: string;
}

type MenuItem = string | MenuItemObj;

interface SubCategory {
    title: string;
    items: MenuItem[];
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
        id: 'lancamentos',
        label: 'LANÇAMENTOS',
        link: '/lancamentos',
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
                items: ['Grêmio', { label: 'Internacional', search: 'Inter' }, 'Juventude', 'Coritiba', 'Athletico-PR', 'Chapecoense']
            }
        ],
        highlightImage: {
            src: 'https://wallpapers4screen.com/Uploads/22-5-2025/77439/thumb2-4k-neymar-back-view-santos-fc-white-neon-lights.jpg',
            alt: 'Neymar Santos',
            title: '',
            price: 'Confira a Coleção'
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
                items: ['Juventus', 'Milan', 'Inter de Milão', 'Roma', 'Bayern de Munique', 'Borussia Dortmund', 'PSG', 'Al-Nassr', 'Inter Miami']
            }
        ],
        highlightImage: {
            src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHQjU96CjlvOzmGI8E7pNTxWokSte3nREvIQ&s',
            alt: 'Clubes Internacionais',
            title: '',
            price: 'Confira a Coleção'
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
            src: 'https://uploads.metroimg.com/wp-content/uploads/2025/10/08131526/cristiano-ronaldo-futebol-portugal.jpg',
            alt: 'Cristiano Ronaldo Portugal',
            title: '',
            price: 'Confira a Coleção'
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
                                {col.items.map((item, i) => {
                                    const label = typeof item === 'string' ? item : item.label;
                                    const searchTerm = typeof item === 'string' ? item : item.search;

                                    return (
                                        <li key={i}>
                                            <Link
                                                to={`${menu.link}?search=${encodeURIComponent(searchTerm)}`}
                                                className="text-gray-500 hover:text-dlsports-green text-sm transition-colors block py-0.5"
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Highlight Image */}
                {menu.highlightImage && (
                    <Link to={menu.link} className="w-72 ml-8 relative group cursor-pointer overflow-hidden rounded-xl block border border-gray-100 shadow-sm">
                        <img
                            src={menu.highlightImage.src}
                            alt={menu.highlightImage.alt}
                            className="w-full h-52 object-cover transform group-hover:scale-110 transition-transform duration-700 group-hover:brightness-110"
                        />
                        {/* Smooth Professional Scrim */}
                        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white text-center">
                            {menu.highlightImage.title && <h3 className="text-xl font-black italic mb-1 drop-shadow-md">{menu.highlightImage.title}</h3>}
                            <p className="text-[10px] uppercase tracking-[0.2em] font-black mb-3 text-white/90 drop-shadow-md">{menu.highlightImage.price}</p>
                            <button className="bg-dlsports-neon text-black px-6 py-2 rounded-full font-black text-[11px] uppercase tracking-tighter hover:scale-105 transition-all shadow-[0_4px_20px_rgba(181,255,0,0.3)] mx-auto">
                                Confira agora
                            </button>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}
