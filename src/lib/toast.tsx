
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
    message: string;
    onClose: () => void;
}

function Toast({ message, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-24 right-4 z-50 animate-fade-in-left">
            <div className="bg-white border-l-4 border-dlsports-green shadow-2xl rounded-lg p-4 flex items-center gap-4 min-w-[300px]">
                <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">Sucesso!</h4>
                    <p className="text-gray-600 text-xs">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="ml-auto text-gray-400 hover:text-gray-600"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export const toast = {
    success: (message: string) => {
        const container = document.getElementById('toast-container');
        if (!container) {
            const newContainer = document.createElement('div');
            newContainer.id = 'toast-container';
            document.body.appendChild(newContainer);
            const root = createRoot(newContainer);
            root.render(<Toast message={message} onClose={() => {
                root.unmount();
                newContainer.remove();
            }} />);
        } else {
            const root = createRoot(container);
            root.render(<Toast message={message} onClose={() => {
                root.unmount();
                container.remove();
            }} />);
        }
    }
};
