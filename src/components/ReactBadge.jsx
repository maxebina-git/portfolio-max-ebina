import { useState } from 'react';

export default function ReactBadge() {
  const [contador, setContador] = useState(0);

  return (
    <div className="p-8 bg-card border border-border rounded-md shadow-sm flex flex-col items-center justify-center">
      <span className="px-3 py-1 bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-400 text-xs font-semibold rounded-full tracking-wide uppercase border border-sky-200">
        Ilha de React 18 Real 🏝️
      </span>
      
      <button 
        onClick={() => setContador(contador + 1)} 
        className="mt-4 px-3 py-1 bg-sky-500 text-white text-xs rounded font-medium cursor-pointer transition-transform active:scale-95"
      >
        Cliques no React: {contador}
      </button>
    </div>
  );
}