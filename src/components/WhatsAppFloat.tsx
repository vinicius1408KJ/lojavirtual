
import { MessageCircle } from 'lucide-react';

export function WhatsAppFloat() {
    return (
        <a
            href="https://wa.me/5511999999999?text=Olá! Vim pelo site da DL Sports e gostaria de tirar uma dúvida."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
        >
            <div className="bg-white text-gray-800 text-xs font-bold py-1 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0 hidden md:block">
                Fale com um especialista
            </div>
            <div className="bg-[#25D366] p-4 rounded-full shadow-lg hover:shadow-[#25D366]/50 hover:scale-110 transition-all duration-300 relative">
                <MessageCircle className="w-8 h-8 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            </div>
        </a>
    );
}
